"use client";
import {
 FcGlobe,
 FcBiotech,
 FcLibrary,
 FcIdea,
 FcCamera,
 FcMusic,
 FcFilmReel,
 FcBusinessContact,
 FcMindMap,
} from "react-icons/fc";
import { FaAtom } from "react-icons/fa";
import { FaDumbbell } from "react-icons/fa6";
import { SlChemistry } from "react-icons/sl";
import { MdComputer } from "react-icons/md";

import { Category } from "@prisma/client";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";
import { useEffect, useState } from "react";

interface CategoriesProps {
 items: Category[];
}
const iconMap: Record<Category["name"], IconType> = {
 "Computer Science": MdComputer,
 Mathematics: FcIdea,
 Physics: FaAtom,
 Music: FcMusic,
 Fitness: FaDumbbell,
 Photography: FcCamera,
 Chemistry: SlChemistry,
 Biology: FcBiotech,
 History: FcLibrary,
 Geography: FcGlobe,
 Literature: FcBusinessContact,
};
const Categories = ({ items }: CategoriesProps) => {
 const [isMounted, setIsMounted] = useState(false);
 //  useEffect(() => {
 //   setIsMounted(true);
 //  }, []);
 //  if (!isMounted) return null;
 return (
  <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
   {items.map((item) => (
    <CategoryItem
     key={item.id}
     label={item.name}
     icon={iconMap[item.name]}
     value={item.id}
    />
   ))}
  </div>
 );
};

export default Categories;
