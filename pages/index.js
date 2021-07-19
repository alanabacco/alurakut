import React from 'react';

import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      {/* <ul>
        {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual}</span>
              </a>
            </li>
          )
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([{
    id: '170720211903',
    title: 'Alurakut',
    image: 'https://alurakut.vercel.app/logo.svg',
    link: 'https://alurakut.vercel.app/'
  }]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  // Pegar os dados da API do github
  React.useEffect(() => {
    // get
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then((respostaDoServidor) => {
      return respostaDoServidor.json();
    })
    .then((respostaCompleta) => {
      setSeguidores(respostaCompleta);
    })

    // Pegar dados do banco de dados...
    // fetch('', {
    //   method: 'POST',
    // })


  }, []) //um array vazio para executar apenas 1 vez, ou passar um parâmetro para executar quando houver modificação nesse parâmetro

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer hoje?</h2>
            <form onSubmit={(e) => { 
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  id: new Date().toISOString,
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image'),
                  link: dadosDoForm.get('link')
                }

                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas);
              }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque a URL da imagem de capa da comunidade"
                  name="image"
                  aria-label="Coloque a URL da imagem de capa da comunidade"
                />
                <input
                  placeholder="Coloque o link da comunidade"
                  name="link"
                  aria-label="Coloque o link da comunidade"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.link}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

// roda no servidor
export async function getServerSideProps(context) {
  const userToken = await nookies.get(context).token;
  //const cookies = nookies.get(context);
  //const token = cookies.USER_TOKEN;

  const { isAuthenticaded } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: userToken,
    }
  }).then((resposta) => resposta.json())

  if (!isAuthenticaded) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(userToken);
  return {
    props: {
      githubUser: githubUser,
    }, // will be passed to the page component as props
  }
}