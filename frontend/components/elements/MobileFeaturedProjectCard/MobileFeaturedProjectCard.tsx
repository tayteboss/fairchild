import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";

const MobileFeaturedProjectCardWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
`;

const Outer = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Inner = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoOuter = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  overflow: hidden;
`;

const VideoInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  mux-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ColorOverlay = styled(motion.div)<{
  $isActive: boolean;
  $bg: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.$bg};
  z-index: 2;
  pointer-events: none;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

type Props = {
  project: ProjectType;
  isOverlayActive?: boolean;
};

const MobileFeaturedProjectCard = (props: Props) => {
  const { project, isOverlayActive } = props;

  return (
    <MobileFeaturedProjectCardWrapper>
      <Outer>
        <InnerWrapper>
          <Inner>
            <VideoOuter>
              <VideoInner>
                <MuxPlayer
                  streamType="on-demand"
                  playbackId={project.video.asset.playbackId}
                  autoPlay="muted"
                  loop={true}
                  thumbnailTime={1}
                  preload="auto"
                  muted
                  playsInline={true}
                  poster={project.fallbackImage.asset.url}
                />
              </VideoInner>
            </VideoOuter>
            <ColorOverlay
              $isActive={isOverlayActive ?? false}
              $bg={project.thumbnailColor?.hex || "var(--colour-fg)"}
            />
          </Inner>
        </InnerWrapper>
      </Outer>
    </MobileFeaturedProjectCardWrapper>
  );
};

export default MobileFeaturedProjectCard;
