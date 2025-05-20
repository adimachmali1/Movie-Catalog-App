import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -400px 0
  }
  100% {
    background-position: 400px 0
  }
`;

const SkeletonWrapper = styled.div`
  width: 200px;
  height: 400px;
  background: #222;
  border-radius: 8px;
  margin: 0.5rem;
  position: relative;
  overflow: hidden;
`;

const SkeletonShimmer = styled.div`
  width: 100%;
  height: 100%;
  animation: ${shimmer} 1.5s infinite linear;
  background: linear-gradient(to right, #222 0%, #444 20%, #222 40%, #222 100%);
  background-size: 800px 100%;
`;

const SkeletonCard = () => {
  return (
    <SkeletonWrapper aria-busy="true" aria-label="Loading content">
      <SkeletonShimmer />
    </SkeletonWrapper>
  );
};

export default SkeletonCard;
