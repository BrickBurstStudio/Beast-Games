import BaseItem, { ItemConstructorArgs } from "./BaseItem";
import { getCharacter } from "shared/utils/functions/getCharacter";

export default class Outfit extends BaseItem {
  material: Enum.Material;

  constructor(args: ItemConstructorArgs & { material: Enum.Material }) {
    super(args);
    this.material = args.material;
  }

  async Equip(player: Player) {
    const character = await getCharacter(player);
    character.GetChildren().forEach((child) => {
      if (child.IsA("Part")) {
        child.Material = this.material;
      }
    });
  }
}
