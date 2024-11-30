import { Cmdr } from "@rbxts/cmdr";

const parent = <Folder>script.Parent;

function isAdmin(userId: number) {
	const admins = [46325130 /* Hazim */, 45950271 /* Bryson */];
	return admins.includes(userId);
}

Cmdr.RegisterDefaultCommands();
Cmdr.RegisterCommandsIn(<Folder>parent.FindFirstChild("commands"));
Cmdr.RegisterTypesIn(<Folder>parent.FindFirstChild("types"));
Cmdr.RegisterHook("BeforeRun", (context) => {
	if (!isAdmin(context.Executor.UserId)) {
		return "You don't have permission to run commands";
	}
});
