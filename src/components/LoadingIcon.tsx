import React from 'react';
import loadingIconSvg from "@/assets/loadingicon.svg";

interface LoadingIconProps {
  className?: string;
  size?: number;
}

export const LoadingIcon: React.FC<LoadingIconProps> = ({
  className = "h-6 w-6",
  size
}) => {
  const style = size ? { width: size, height: size } : {};

  return (
    <img
      src={loadingIconSvg}
      alt="Loading"
      className={`${className} animate-spin`}
      style={style}
    />
  );
};