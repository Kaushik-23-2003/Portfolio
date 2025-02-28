"use client";

import { Skill } from "../utils/interface";
import { ParallaxText } from "./ui/ParallaxText";

interface SkillsProps {
  skills: Skill[];
}

function Skills({ skills }: SkillsProps) {
  // Create a repeated skills array for infinite effect
  const repeatedSkills = [...skills, ...skills, ...skills]; // Repeat 3 times

  return (
    <section id="skills">
      <ParallaxText baseVelocity={-4}>
        {repeatedSkills.map((skill, index) => // Use repeatedSkills and index
          skill.enabled ? (
            <span
              key={`${skill._id}-${index}`} // Use index in key for repeated items
              className="md:text-7xl text-xl font-semibold uppercase text-white/30 tracking-tighter"
            >
              {skill.name} •
            </span>
          ) : null
        )}
      </ParallaxText>
      <ParallaxText baseVelocity={4}>
        {repeatedSkills.map((skill, index) => // Use repeatedSkills and index
          skill.enabled ? (
            <span
              key={`${skill._id}-${index}`} // Use index in key for repeated items
              className="md:text-7xl text-xl font-semibold uppercase text-white/30 tracking-tighter"
            >
              {skill.name} •
            </span>
          ) : null
        )}
      </ParallaxText>
      <ParallaxText baseVelocity={-4}>
        {repeatedSkills.map((skill, index) => // Use repeatedSkills and index
          skill.enabled ? (
            <span
              key={`${skill._id}-${index}`} // Use index in key for repeated items
              className="md:text-7xl text-xl font-semibold uppercase text-white/30 tracking-tighter"
            >
              {skill.name} •
            </span>
          ) : null
        )}
      </ParallaxText>
    </section>
  );
}

export default Skills;