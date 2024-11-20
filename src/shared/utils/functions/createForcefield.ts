import Make from "@rbxts/make";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

const BARRIER_THICKNESS = 0.2;

type ForcefieldOptions = {
	cframe: CFrame;
	size: Vector3;
	color: Vector3;
};

export default function createForcefield(arg: ForcefieldOptions | Part) {
	let cframe: CFrame;
	let size: Vector3;
	let color: Vector3;

	if (typeOf(arg) === "table") {
		arg = arg as ForcefieldOptions;
		cframe = arg.cframe;
		size = arg.size;
		color = arg.color;
	} else {
		arg = arg as Part;
		cframe = arg.CFrame;
		size = arg.Size;
		color = new Vector3(arg.Color.R, arg.Color.G, arg.Color.B);
		arg.Destroy();
	}

	const forcefield = ReplicatedStorage.Assets.Objects.Forcefield.Clone();
	forcefield.CFrame = cframe;
	forcefield.Mesh.Scale = size;
	forcefield.Mesh.VertexColor = color;
	forcefield.CanCollide = false;

	["X", "Y", "Z"].forEach((axis) => {
		const barrierSize = new Vector3(
			axis === "X" ? size[axis] : BARRIER_THICKNESS + (axis === "Z" ? size.X : 0),
			axis === "Y" ? size[axis] : BARRIER_THICKNESS + (axis === "X" ? size.Y : 0),
			axis === "Z" ? size[axis] : BARRIER_THICKNESS + (axis === "Y" ? size.Z : 0),
		);

		const barrier = Make("Part", {
			Anchored: true,
			Size: barrierSize,
			CFrame: cframe,
			Material: Enum.Material.Metal,
			Parent: forcefield,
			Transparency: 1,
		});
		const barrierClone = barrier.Clone();

		const offset = new Vector3(
			axis === "Y" ? size.X / 2 : 0,
			axis === "Z" ? size.Y / 2 : 0,
			axis === "X" ? size.Z / 2 : 0,
		);
		barrier.CFrame = cframe.mul(new CFrame(offset));
		barrierClone.CFrame = barrier.CFrame.mul(new CFrame(offset.mul(-2)));
		barrierClone.Parent = forcefield;
	});

	forcefield.Parent = Workspace;
	return forcefield;
}
