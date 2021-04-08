import React from "react";

type Size = "small" | "large" | "medium";

interface ImageAvatarProps {
  size: Size;
  imageUrl: string;
}
interface LetterAvatarProps {
  size: Size;
  letter: string;
}

export const ImageAvatar = ({ size, imageUrl }: ImageAvatarProps) => {
  const avatarSize =
    size === "small"
      ? "h-12 w-12"
      : size === "medium"
      ? "h-16 w-16"
      : "h-28 w-28";

  return (
    <div
      className={`${avatarSize} rounded-full bg-cover`}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    ></div>
  );
};

export const LetterAvatar = ({ size, letter }: LetterAvatarProps) => {
  const avatarSize =
    size === "small"
      ? "h-12 w-12"
      : size === "medium"
      ? "h-16 w-16"
      : "h-28 w-28";

  const letterSize =
    size === "small" ? "text-2xl" : size === "medium" ? "text-3xl" : "text-5xl";

  return (
    <div
      className={`${avatarSize} bg-gray-700 rounded-full text-white flex justify-center items-center overflow-hidden`}
    >
      {/* <span>{{letterAvatar}}</span> */}
      <span className={`${letterSize}`}>{letter}</span>
    </div>
  );
};
