import Object from "@rbxts/object-utils";

const colors = {
  Red: Color3.fromRGB(132, 46, 34),
  Orange: Color3.fromRGB(165, 80, 30),
  Yellow: Color3.fromRGB(184, 149, 23),
  "Lime Green": Color3.fromRGB(33, 136, 29),
  "Dark Green": Color3.fromRGB(44, 68, 48),
  Cyan: Color3.fromRGB(66, 151, 211),
  Blue: Color3.fromRGB(45, 78, 186),
  Purple: Color3.fromRGB(81, 30, 191),
  Magenta: Color3.fromRGB(129, 0, 129),
  Pink: Color3.fromRGB(197, 106, 188),
  White: Color3.fromRGB(180, 180, 180),
  Black: Color3.fromRGB(26, 26, 26),
  Brown: Color3.fromRGB(84, 44, 6),
  Grey: Color3.fromRGB(99, 95, 98),
};

export function randomColor(
  excludeColor?: Color3,
): [Color3, Array<Color3>, string] {
  const index = math.random(0, Object.entries(colors).size() - 1);
  const color = Object.values(colors)[index] as Color3;
  const name = Object.keys(colors)[index] as string;

  // Create a new array without the selected color and the excluded color
  const subtraction = Object.values(colors).filter(
    (c) => c !== color && c !== excludeColor,
  );

  return [color, subtraction, name];
}
