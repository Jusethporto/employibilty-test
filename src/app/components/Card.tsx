import React from "react";
import styled from "styled-components";

interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onClick?: () => void;
}

const CardContainer = styled.div`
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #333;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.4;
`;

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <CardContainer onClick={onClick}>
      {imageUrl && <CardImage src={imageUrl} alt={title} />}
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardContent>
    </CardContainer>
  );
};
