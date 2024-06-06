/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectProps {
  title: string;
  image: string;
  description: string;
  stack: String[];
  links?: Link[];
}

interface Link {
  display: string;
  url: string;
}

const ProjectCard = ({
  title,
  image,
  description,
  stack,
  links,
}: ProjectProps) => {
  const stack_items = stack.map((item, index) => (
    <div key={index} className="bg-secondary text-text-button p-2 rounded-md">
      {item}
    </div>
  ));

  const link_items = links?.map((item, index) => (
    <Link
      key={index}
      className="btn-accent"
      href={item.url}
      target="_blank"
      rel="noreferrer"
    >
      {item.display}
    </Link>
  ));

  return (
    <div className="card !rounded-2xl flex flex-col justify-center max-w-lg !shadow-xl relative m-8 p-4">
      <div className="w-full h-36 md:h-72 relative">
        <Image
          alt="Mountains"
          src={image}
          fill={true}
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="px-4 pt-2 md:py-4">
        <h2 className="mb-2 text-2xl">{title}</h2>
        <p>{description}</p>
        <h3 className="mt-4 text-xl">Languages and Frameworks</h3>
        <div className="flex gap-4 my-2 flex-wrap">{stack_items}</div>

        {links != undefined && (
          <div>
            <h3 className="mt-4 text-xl">Links</h3>
            <div className="flex gap-4 my-2 flex-wrap">{link_items}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
