import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CocNavBar from "../../../../components/clashofclans/CocNavBar";
import {
  ClanWarLeagueCLan,
  ClanWarLeagueRound,
  LeagueGroup,
} from "../../../../shared/interfaces/coc.interface";
import Link from "next/link";
import axios from "axios";
import { SpinningCircles } from "react-loading-icons";
import { useQuery } from "react-query";
import CocLoadingOrError from "../../../../components/clashofclans/CocLoadingOrError";

export interface RoundProps {
  round: ClanWarLeagueRound;
  round_number: number;
}

const title = "Clan War League";

const LeagueClan = (clan: ClanWarLeagueCLan) => {
  return (
    <Link href={`/ClashOfClans/clan/${clan.tag.substring(1)}`}>
      <div className="bg-orange-900 flex justify-between p-4 rounded-md clash-font-style border-2 border-black hover:bg-[#431407] transition-all">
        <div>{clan.name}</div>
        <div>Lvl {clan.clanLevel}</div>
      </div>
    </Link>
  );
};

const Round = ({ round, round_number }: RoundProps) => {
  const tags = round.warTags.map((tag, i) => {
    if (tag === "#0") {
      return (
        <div key={i} className="py-1">
          Not available
        </div>
      );
    } else {
      return (
        <Link
          className="hover:bg-[#4a044e] py-1 px-4 rounded-md transition-all"
          key={i}
          href={`/ClashOfClans/clanwarleague/${tag.substring(1)}`}
        >
          {tag}
        </Link>
      );
    }
  });

  return (
    <div className="flex flex-col clash-font-style items-center border-2 border-black rounded-md py-2 bg-purple-900/70">
      <div className="text-2xl text-yellow-100">{round_number}</div>
      <div className="coc-font-style flex flex-col">{tags}</div>
    </div>
  );
};

const fetchLeague = (clanTag: string) =>
  axios
    .get(`/api/clashofclans/clan/${clanTag}/clanwarleague`)
    .then(({ data }) => data);

const ClanWarLeague = () => {
  const router = useRouter();
  const clanTag =
    typeof router.query?.clanTag === "string" ? router.query.clanTag : "";

  const { isLoading, error, data } = useQuery<LeagueGroup>({
    queryKey: ["leagueGroup", clanTag],
    queryFn: () => fetchLeague(clanTag),
    enabled: router.isReady,
  });

  if (error instanceof Error)
    return CocLoadingOrError({
      heading: title,
      info: (
        <p className="text-center coc-font-style m-8 text-2xl">
          Unable to fetch clan war league data: {error.message}
        </p>
      ),
    });

  if (isLoading || data === undefined)
    return CocLoadingOrError({
      heading: title,
      info: <SpinningCircles className="mx-auto mt-8" />,
    });

  const clans = data.clans.map((item, index) => {
    return (
      <LeagueClan
        key={index}
        tag={item.tag}
        clanLevel={item.clanLevel}
        name={item.name}
        members={item.members}
      />
    );
  });

  const rounds = data.rounds.map((item, index) => {
    return <Round key={index} round={item} round_number={index + 1} />;
  });

  return (
    <div className="bg-clash min-h-screen pb-4">
      <CocNavBar />
      <h2 className="text-center pt-20 clash-font-style font-thin">
        Clan War League
      </h2>
      {
        <div>
          <div className="flex flex-col my-4 mx-2 pb-4 md:mx-4 rounded-lg border-2 border-black bg-gradient-to-b from-[#7d643c] to-[#9f815e]">
            <div className="self-center clash-font-style my-2">
              <span className="text-yellow-100 text-2xl">
                Season {data.season}
              </span>
            </div>
            <div className="flex flex-col gap-4 mx-2">{clans}</div>
          </div>
          <div className="flex flex-col my-4 mx-2 pb-4 md:mx-4 rounded-lg border-2 border-black bg-gradient-to-b from-[#9f815e] to-[#7d643c] ">
            <div className="self-center clash-font-style my-2">
              <span className="text-yellow-100 text-2xl">Rounds</span>
            </div>
            <div className="mx-2 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
              {rounds}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ClanWarLeague;
