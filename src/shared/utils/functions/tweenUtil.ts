import { RunService, TweenService } from "@rbxts/services";

export function tweenScale(
	startScale: number,
	endScale: number,
	tweenInfo: TweenInfo,
	model: Model,
	callback: (scale: number, alpha: number) => void = () => {},
) {
	return new Promise((resolve) => {
		let elapsed = 0;
		let scale = 0.1;
		let tweenConnection: RBXScriptConnection;
		const ogCFrame = model.GetPivot();

		function onStep(deltaTime: number) {
			elapsed = math.min(elapsed + deltaTime, tweenInfo.Time);

			const alpha = TweenService.GetValue(
				elapsed / tweenInfo.Time,
				tweenInfo.EasingStyle,
				tweenInfo.EasingDirection,
			);

			scale = startScale + alpha * (endScale - startScale);
			model.PivotTo(
				ogCFrame.mul(new CFrame(0, scale - (scale - alpha) / 2, 0).mul(CFrame.Angles(0, alpha * 2, 0))),
			);

			if (scale > 0) model.ScaleTo(scale);
			callback(scale, alpha);

			if (elapsed === tweenInfo.Time) {
				tweenConnection.Disconnect();
				resolve(undefined);
			}
		}

		tweenConnection = RunService.Heartbeat.Connect(onStep);
	});
}

export function tweenNumber(
	startScale: number,
	endScale: number,
	tweenInfo: TweenInfo,
	updateFunc: (value: number) => void,
) {
	return new Promise((resolve) => {
		let elapsed = 0;
		let value = 0;
		let tweenConnection: RBXScriptConnection;

		function onStep(deltaTime: number) {
			elapsed = math.min(elapsed + deltaTime, tweenInfo.Time);

			const alpha = TweenService.GetValue(
				elapsed / tweenInfo.Time,
				tweenInfo.EasingStyle,
				tweenInfo.EasingDirection,
			);

			value = startScale + alpha * (endScale - startScale);
			updateFunc(value);

			if (elapsed === tweenInfo.Time) {
				tweenConnection.Disconnect();
				resolve(undefined);
			}
		}

		tweenConnection = RunService.Heartbeat.Connect(onStep);
	});
}
