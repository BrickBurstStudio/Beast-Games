import { CharacterRigR6 } from "@rbxts/promise-character";
import { OrderedPlayerData } from "server/classes/OrderedPlayerData";
import { Events } from "server/network";
import { store } from "server/store";
import { announce } from "server/util/announce";
import { countdown } from "server/util/countdown";
import { ChallengeName } from "shared/configs/gui";
import { BasePlatformChallenge } from "./base-platform.challenge";

type PlayerChoice = "split" | "steal" | undefined;

export class SplitOrStealChallenge extends BasePlatformChallenge {
	private readonly PRIZE_MONEY = 5_000_000;
	private readonly DECISION_TIME = 30;
	protected readonly challengeName: ChallengeName = "Split or Steal";
	protected readonly rules = [
		"You both must each choose to SPLIT or STEAL the $5,000,000 prize.",
		"If both SPLIT, you each get $2,500,000",
		"If one STEAL and other SPLIT, stealer gets all $5,000,000",
		"If both STEAL, neither player gets anything",
	];

	private playerChoices = new Map<Player, PlayerChoice>();

	protected async main() {
		// Create network events
		Events.challenges.splitOrStealChallenge.makeChoice.connect((player, choice) => {
			if (this.playerChoices.get(player) !== undefined) return;
			this.playerChoices.set(player, choice);
			this.changePlatformState(player, "warning");

			// Check if all players have made their choices
			if (this.playersInChallenge.every((p) => this.playerChoices.get(p) !== undefined)) {
				Events.announcer.clearCountdown.broadcast();
				this.processResults();
			}
		});

		// Start the countdown
		const countdownPromise = countdown({
			seconds: this.DECISION_TIME,
			description: "Make your choice!",
		});

		// Wait for either countdown to finish or choices to be made
		await Promise.race([
			countdownPromise,
			new Promise<void>((resolve) => {
				// This will be called when processResults is triggered
				this.resolveEarly = resolve;
			}),
		]);

		// Only clear countdown if it wasn't already cleared
		if (!this.resolveEarly) {
			Events.announcer.clearCountdown.broadcast();
			await this.processResults();
		}

		store.setChallenge(undefined);
	}

	private resolveEarly?: () => void;

	private async processResults() {
		// Process results
		const choices = this.playersInChallenge.map((p) => ({
			player: p,
			choice: this.playerChoices.get(p),
		}));

		// If neither player made a choice, both lose
		if (choices.every((c) => c.choice === undefined)) {
			await this.handleNoChoices(choices[0].player, choices[1].player);
			return;
		}

		// If one player didn't choose, then other player gets all the money
		const nonChoosingPlayer = choices.find((c) => c.choice === undefined);
		if (nonChoosingPlayer) {
			const otherPlayer = choices.find((c) => c.choice !== undefined)!;
			await this.handleOneNoChoiceOneChoice(nonChoosingPlayer.player, otherPlayer.player);
			return;
		}

		// Both players made choices - process normally
		if (choices[0].choice === "split" && choices[1].choice === "split") {
			await this.handleBothSplit(choices[0].player, choices[1].player);
		} else if (choices[0].choice === "steal" && choices[1].choice === "steal") {
			await this.handleBothSteal(choices[0].player, choices[1].player);
		} else {
			const stealer = choices.find((c) => c.choice === "steal")!;
			const splitter = choices.find((c) => c.choice === "split")!;
			await this.handleOneStealOneSplit(stealer.player, splitter.player);
		}

		if (this.resolveEarly) {
			this.resolveEarly();
		}
	}

	private async handleBothSplit(player1: Player, player2: Player) {
		const splitAmount = this.PRIZE_MONEY / 2;
		await announce(["Both players chose to SPLIT!", `Each player receives $${splitAmount}!`]);

		const data1 = new OrderedPlayerData(player1);
		const data2 = new OrderedPlayerData(player2);
		data1.wins.UpdateBy(1);
		data1.cash.UpdateBy(splitAmount);
		data2.wins.UpdateBy(1);
		data2.cash.UpdateBy(splitAmount);
	}

	private async handleBothSteal(player1: Player, player2: Player) {
		await announce(["Both players chose to STEAL!", "Neither player receives any money!"]);
		this.dropCharacter(player1.Character as CharacterRigR6);
		this.dropCharacter(player2.Character as CharacterRigR6);
	}

	private async handleOneStealOneSplit(stealer: Player, splitter: Player) {
		await announce([
			`${stealer.Name} chose to STEAL while their opponent chose to SPLIT!`,
			`${stealer.Name} receives the entire $${this.PRIZE_MONEY}!`,
		]);

		const data = new OrderedPlayerData(stealer);
		data.wins.UpdateBy(1);
		data.cash.UpdateBy(this.PRIZE_MONEY);
		this.dropCharacter(splitter.Character as CharacterRigR6);
	}

	private async handleNoChoices(player1: Player, player2: Player) {
		await announce([
			"Time's up! Neither player made a choice!",
			"Indecision has consequences - both players are eliminated!",
		]);
		this.dropCharacter(player1.Character as CharacterRigR6);
		this.dropCharacter(player2.Character as CharacterRigR6);
	}

	private async handleOneNoChoiceOneChoice(nonChoosingPlayer: Player, choosingPlayer: Player) {
		await announce([
			`${nonChoosingPlayer.Name} failed to choose in time!`,
			`${choosingPlayer.Name} receives the entire $${this.PRIZE_MONEY}!`,
		]);

		const data = new OrderedPlayerData(nonChoosingPlayer);
		data.wins.UpdateBy(1);
		data.cash.UpdateBy(this.PRIZE_MONEY);
		this.dropCharacter(nonChoosingPlayer.Character as CharacterRigR6);
	}
}
