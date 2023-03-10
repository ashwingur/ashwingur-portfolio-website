import React from "react";
import { ClanMember } from "../../shared/interfaces/coc.interface";
import Image from "next/image";
import { useRouter } from "next/router";

interface ClanMemberElementProps {
  clanMember: ClanMember;
}

const ClanMemberElement = ({ clanMember }: ClanMemberElementProps) => {
  const router = useRouter();

  const clanMemberClick = () => {
    router.push(`/ClashOfClans/player/${clanMember.tag.substring(1)}`);
  };

  return (
    <div
      className="bg-gray-200 flex flex-col md:flex-row justify-between my-2 px-2 py-2 md:py-0 cursor-pointer rounded-lg border-gray-800 border-2 hover:bg-gray-300 transition-all"
      onClick={clanMemberClick}
    >
      <div className="flex mx-auto md:mx-0 md:py-1">
        <div className="self-center md:w-6 text-white font-clash [text-shadow:_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_-1px_2px_black]">
          {clanMember.clanRank}.
        </div>
        <div className="w-[1px] my-1 mx-2 md:bg-gray-400" />
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <Image
            alt={clanMember.league.name}
            src={
              clanMember.league.name === "Unranked"
                ? "/assets/coc/Unranked_League.webp"
                : clanMember.league.iconUrls.medium
            }
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="w-[1px] my-1 mx-2 md:bg-gray-400" />
        <div>
          <div className="text-white font-clash [text-shadow:_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_-1px_2px_black]">
            {clanMember.name}
          </div>

          <div className="text-slate-700 font-coc font-thin">
            {mapPlayerRole(clanMember.role)}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center md:flex-row gap-2 md:gap-0">
        <div className="flex flex-col items-center px-8">
          <div className="font-coc font-thin text-slate-700">
            Troops donated:
          </div>
          <div className="font-coc font-thin bg-white w-full text-center rounded-md dark:text-black">
            {clanMember.donations}
          </div>
        </div>
        <div className="flex flex-col items-center mx-8">
          <div className="font-coc font-thin text-slate-700">
            Troops received:
          </div>
          <div className="font-coc font-thin bg-white w-full text-center rounded-md dark:text-black">
            {clanMember.donationsReceived}
          </div>
        </div>

        <div className="flex items-center border-2 border-white rounded-md px-4 bg-gradient-to-b from-yellow-100 to-yellow-300 w-28">
          <div className="mr-2 text-white font-clash [text-shadow:_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_2px_1px_black,_0_-1px_2px_black]">
            {clanMember.trophies}
          </div>
          <Image
            alt="trophy"
            src={"/assets/coc/cocTrophy.webp"}
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
};

const mapPlayerRole = (role: string) => {
  switch (role) {
    case "leader":
      return "Leader";
    case "coLeader":
      return "Co-leader";
    case "admin":
      return "Elder";
    case "member":
      return "Member";
  }
  return "";
};

export default ClanMemberElement;
