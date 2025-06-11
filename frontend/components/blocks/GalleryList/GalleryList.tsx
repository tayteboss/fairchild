import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import GalleryCard from "../../elements/GalleryCard";
import { useMouseMovement } from "../../../hooks/useMouseMovement";
import { useHeader } from "../../layout/HeaderContext";

const GalleryListWrapper = styled.div`
  .layout-grid {
    grid-row-gap: 0;
    grid-column-gap: 0;
  }
`;

type Props = {
  data: ProjectType[];
};

const GalleryList = (props: Props) => {
  const { data } = props;
  const { setHeaderText, setIsHovering } = useHeader();
  const { hasMoved } = useMouseMovement({
    initialDelay: 2000,
    movementThreshold: 5,
    throttleMs: 100,
  });

  const hasData = data && data.length > 0;

  return (
    <GalleryListWrapper>
      <LayoutWrapper>
        <LayoutGrid>
          {hasData &&
            data.map(
              (project, i) =>
                project.gallery?.length > 0 &&
                project.gallery.map((galleryItem, j) => (
                  <GalleryCard
                    key={`${i}-${j}`}
                    project={project}
                    gallery={galleryItem}
                    hasMouseMoved={hasMoved}
                    setHeaderText={setHeaderText}
                    setIsHovering={setIsHovering}
                  />
                ))
            )}
        </LayoutGrid>
      </LayoutWrapper>
    </GalleryListWrapper>
  );
};

export default GalleryList;
