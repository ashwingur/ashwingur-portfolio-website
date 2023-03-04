import Image from "next/image";
import React from "react";
import { Player, PlayerItemLevel } from "../../shared/interfaces/coc.interface";

interface CocPlayerArmyProps {
  player: Player;
}

interface ArmyItemsCategoryProps {
  items: PlayerItemLevel[];
  category: string;
  showLevel: boolean;
}

interface ArmyItemIconProps {
  playerItemLevel: PlayerItemLevel;
  showLevel: boolean;
}

const ArmyItemIcon = ({ playerItemLevel, showLevel }: ArmyItemIconProps) => {
  const icon_name: string = playerItemLevel.name.replaceAll(" ", "_");
  return (
    <div className="border-black border-2 inline-block rounded-md relative font-clash font-thin">
      <Image
        src={`/assets/coc/troops/icons/${icon_name}.png`}
        alt={playerItemLevel.name}
        width={64}
        height={64}
      />
      {showLevel && (
        <div
          className={
            "inline-block absolute bottom-1 left-1 rounded-md w-6 h-6 shadow-[0_0px_3px_1px_rgba(0,0,0,0.3)] shadow-white" +
            (playerItemLevel.level != playerItemLevel.maxLevel
              ? " bg-black"
              : " bg-yellow-500")
          }
        >
          <div className="text-white px-[2px] text-center">
            {playerItemLevel.level}
          </div>
        </div>
      )}
    </div>
  );
};

const ArmyItemsCategory = ({
  items,
  category,
  showLevel,
}: ArmyItemsCategoryProps) => {
  const items_elements = items.map((item, index) => (
    <ArmyItemIcon key={index} playerItemLevel={item} showLevel={showLevel} />
  ));

  return (
    <div className="bg-[#5d6b96] p-4 mx-4 md:mx-8 rounded-lg my-4">
      <div className=" clash-font-style text-xl mb-4">{category}</div>
      <div className="flex flex-row flex-wrap gap-1 ">{items_elements}</div>
    </div>
  );
};

const CocPlayerArmy = ({ player }: CocPlayerArmyProps) => {
  const siege_machine_names = [
    "Wall Wrecker",
    "Battle Blimp",
    "Stone Slammer",
    "Siege Barracks",
    "Log Launcher",
    "Flame Flinger",
    "Battle Drill",
  ];

  const super_troop_names = [
    "Super Barbarian",
    "Super Archer",
    "Super Giant",
    "Sneaky Goblin",
    "Super Wall Breaker",
    "Rocket Balloon",
    "Super Wizard",
    "Super Dragon",
    "Inferno Dragon",
    "Super Miner",
    "Super Minion",
    "Super Valkyrie",
    "Super Witch",
    "Ice Hound",
    "Super Bowler",
  ];

  const pet_names = [
    "L.A.S.S.I",
    "Electro Owl",
    "Mighty Yak",
    "Unicorn",
    "Frosty",
    "Diggy",
    "Poison Lizard",
    "Phoenix",
  ];

  const normal_troops = player.troops.filter(
    (item) =>
      !(
        siege_machine_names.includes(item.name) ||
        super_troop_names.includes(item.name) ||
        pet_names.includes(item.name) ||
        item.village == "builderBase"
      )
  );

  const siege_machines = player.troops.filter((item) =>
    siege_machine_names.includes(item.name)
  );

  const super_troops = player.troops.filter((item) =>
    super_troop_names.includes(item.name)
  );

  const pets = player.troops.filter((item) => pet_names.includes(item.name));

  const builder_troops = player.troops.filter(
    (item) => item.village == "builderBase"
  );

  return (
    <div>
      <ArmyItemsCategory
        items={normal_troops}
        category="Troops"
        showLevel={true}
      />
      {/* <ArmyItemsCategory
        items={super_troops}
        category="Super Troops"
        showLevel={false}
      /> */}
      <ArmyItemsCategory
        items={siege_machines}
        category="Siege Machines"
        showLevel={true}
      />
      <ArmyItemsCategory
        items={builder_troops}
        category="Builder Base"
        showLevel={true}
      />
      <ArmyItemsCategory
        items={player.spells}
        category="Spells"
        showLevel={true}
      />
      <ArmyItemsCategory
        items={player.heroes}
        category="Heroes"
        showLevel={true}
      />
      <ArmyItemsCategory items={pets} category="Pets" showLevel={true} />
    </div>
  );
};

export default CocPlayerArmy;
