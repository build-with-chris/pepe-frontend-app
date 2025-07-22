import React from 'react';
import LogoImage from '../../assets/LogoPepe.png';
import { Link } from 'react-router'

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <Link to="/">

    <img
      src={LogoImage}
      alt="Pepe Logo"
      width={62}
      height={16}
      {...props}
    />
  </Link>
);
