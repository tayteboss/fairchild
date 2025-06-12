import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const CreditsModalWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${pxToRem(64)};
  cursor: pointer;
`;

const CreditsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(64)};
  width: 50vw;
  padding: ${pxToRem(16)};
  cursor: crosshair;

  a {
    cursor: pointer;

    &:hover {
      .credit-title {
        text-decoration: underline;
      }
    }
  }
`;

const CreditsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CreditsItemRole = styled.p`
  text-align: center;
  opacity: 0.3;
  color: var(--colour-white);
`;

const CreditsItemTitle = styled.p`
  text-align: center;
  color: var(--colour-white);
`;

const CloseTrigger = styled.button`
  text-align: center;
  opacity: 0.5;
  color: var(--colour-white);

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 1;
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  project: ProjectType | null;
};

const CreditsModal = (props: Props) => {
  const { project, isOpen, setIsOpen } = props;

  const hasCredits = project?.credits && project?.credits.length > 0;

  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  console.log("project", project);

  return (
    <AnimatePresence>
      {isOpen && (
        <CreditsModalWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {hasCredits ? (
            <>
              <CreditsList ref={ref}>
                {project?.credits.map((credit, index) =>
                  credit?.link ? (
                    <Link
                      href={credit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                    >
                      <CreditsItem>
                        <CreditsItemRole>{credit.role}</CreditsItemRole>
                        <CreditsItemTitle className="credit-title">
                          {credit.title}
                        </CreditsItemTitle>
                      </CreditsItem>
                    </Link>
                  ) : (
                    <CreditsItem key={index}>
                      <CreditsItemRole>{credit.role}</CreditsItemRole>
                      <CreditsItemTitle>{credit.title}</CreditsItemTitle>
                    </CreditsItem>
                  )
                )}
              </CreditsList>
              <CloseTrigger onClick={() => setIsOpen(false)}>
                Close
              </CloseTrigger>
            </>
          ) : (
            <div ref={ref}>N/A</div>
          )}
        </CreditsModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default CreditsModal;
