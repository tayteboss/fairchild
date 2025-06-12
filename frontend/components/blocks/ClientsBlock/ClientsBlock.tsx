import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";

const ClientsBlockWrapper = styled.div`
  width: 100%;
  mix-blend-mode: difference;
`;

const Title = styled.h3`
  text-align: center;
  text-transform: uppercase;
  margin-bottom: ${pxToRem(48)};
`;

const Clients = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClientWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(16)};
`;

const ClientName = styled.div`
  flex: 1;
  width: ${pxToRem(300)};
  text-align: right;
  text-transform: initial !important;
  white-space: nowrap;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: auto;
    min-width: 150px;
  }
`;

const ClientTitle = styled.div`
  flex: 1;
  width: ${pxToRem(300)};
  text-align: left;
  text-transform: initial !important;
  white-space: nowrap;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: auto;
    min-width: 150px;
  }
`;

type Props = {
  clients: InformationPageType["clients"];
};

const ClientsBlock = (props: Props) => {
  const { clients } = props;

  const hasClients = clients.length > 0;

  return (
    <ClientsBlockWrapper>
      <Title>Clients</Title>
      {hasClients && (
        <Clients>
          {clients.map((client, i) => (
            <ClientWrapper key={i}>
              <ClientName>
                {client.link ? (
                  <a
                    href={client.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {client.name}
                  </a>
                ) : (
                  client.name
                )}
              </ClientName>
              <ClientTitle>{client.title}</ClientTitle>
            </ClientWrapper>
          ))}
        </Clients>
      )}
    </ClientsBlockWrapper>
  );
};

export default ClientsBlock;
