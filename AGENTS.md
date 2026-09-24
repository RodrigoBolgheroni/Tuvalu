# CONTEXTO

Você é responsável por reconstruir do zero uma aplicação web educativa chamada:

# Tuvalu Time Machine

Use o vídeo de referência anexado como a PRINCIPAL FONTE DE VERDADE para:
- layout;
- proporções;
- identidade visual;
- hierarquia tipográfica;
- animações;
- interações;
- comportamento da timeline;
- comportamento do mapa;
- painel lateral;
- navegação entre visão geral e visão de uma ilha.

O objetivo NÃO é criar apenas algo "inspirado" no vídeo.

Quero uma reprodução visual e funcional extremamente próxima da referência, preservando a mesma experiência.

Porém há um requisito adicional importante:

O mapa inicial pode utilizar uma representação simplificada das nove ilhas de Tuvalu, como no vídeo, mas ao clicar em uma ilha a aplicação deve carregar uma representação 3D baseada no TERRITÓRIO REAL daquela ilha, usando sua geometria/coastline real.

Não substitua isso por formas aleatórias ou modelos fictícios.

---

# 1. OBJETIVO DA EXPERIÊNCIA

A aplicação deve funcionar como uma máquina do tempo climática de Tuvalu.

O usuário deve conseguir:

1. visualizar todas as ilhas de Tuvalu;
2. selecionar uma ilha;
3. entrar em uma visualização 3D dessa ilha;
4. navegar pelo modelo 3D;
5. avançar ou retroceder no tempo;
6. observar mudanças relacionadas a:
   - seca;
   - disponibilidade de água;
   - intrusão salina;
   - aumento do nível do mar;
   - edificações;
   - vegetação;
   - vulnerabilidade territorial;
7. ler informações específicas sobre aquela ilha e aquele período;
8. voltar para o mapa geral sem recarregar a página.

A navegação deve parecer uma única experiência contínua.

---

# 2. ILHAS

A aplicação deve conter as nove ilhas/atóis de Tuvalu:

Nanumea
Nanumaga
Niutao
Nui
Vaitupu
Nukufetau
Funafuti
Nukulaelae
Niulakita

Classifique corretamente cada uma como atoll ou reef island quando aplicável.

Cada ilha deve possuir seu próprio conjunto de dados.

Não quero apenas um texto nacional de Tuvalu sendo reutilizado para todas.

Cada ilha deve possuir informações como:

- nome;
- tipo;
- localização;
- área aproximada;
- população, quando houver dado confiável;
- principais assentamentos;
- características geográficas;
- disponibilidade de água;
- dependência de água da chuva;
- vulnerabilidade à seca;
- vulnerabilidade à intrusão salina;
- características da vegetação;
- infraestrutura relevante;
- exposição ao aumento do nível do mar;
- acontecimentos climáticos relevantes;
- projeções futuras.

Quando não existir um dado confiável específico para determinada ilha, deixe isso claro.

Nunca invente estatísticas.

---

# 3. LAYOUT GERAL

A aplicação deve ocupar 100vw x 100vh.

Ela deve ter três grandes regiões:

HEADER
aproximadamente 9–10% da altura.

CONTEÚDO PRINCIPAL
aproximadamente 76–78% da altura.

TIMELINE
aproximadamente 12–14% da altura.

Dentro do conteúdo principal:

MAPA / CENA 3D
aproximadamente 72% da largura.

PAINEL DE INFORMAÇÕES
aproximadamente 28% da largura.

Esse equilíbrio visual deve ser muito próximo do vídeo.

Não transforme o site em uma landing page tradicional.

A experiência inteira deve permanecer semelhante a uma aplicação cartográfica/editorial.

---

# 4. IDENTIDADE VISUAL

Reproduza a identidade visual mostrada no vídeo.

Paleta aproximada:

fundo do header:
creme / off-white.

oceano:
azul-petróleo / teal bem escuro.

painel lateral:
amarelo-creme suave.

cor de destaque:
coral / vermelho queimado.

marcadores das ilhas:
amarelo suave / creme.

texto principal:
azul-marinho muito escuro.

Utilize pequenas variações e textura sutil para evitar aparência excessivamente digital.

O mapa deve possuir uma leve textura/granulação no oceano.

Evite:
- gradients modernos exagerados;
- glassmorphism;
- neon;
- cards arredondados genéricos;
- visual SaaS;
- sombras grandes;
- interface parecida com dashboard corporativo.

A estética deve parecer uma mistura de:

atlas;
editorial;
documentário climático;
mapa científico;
jornal impresso.

---

# 5. TIPOGRAFIA

O título:

Tuvalu Time Machine

deve utilizar uma fonte serifada editorial pesada.

Use algo visualmente próximo de:
Fraunces,
DM Serif Display,
Cormorant,
ou outra serif equivalente.

Não use uma fonte moderna sans-serif para o título.

Os textos auxiliares podem utilizar sans-serif ou monoespaçada discreta.

Os anos grandes do painel lateral devem usar a mesma linguagem editorial do título.

---

# 6. HEADER

No canto superior esquerdo:

NINE ISLANDS · ONE CHANGING CLIMATE

logo abaixo:

Tuvalu Time Machine

No centro do header, quando nenhuma ilha estiver selecionada:

Choose an island to enter the time machine.

Quando uma ilha estiver selecionada:

Move through the timeline to see the selected island respond.

No canto direito:

Climate terms +

Deve funcionar como botão/dropdown para explicar termos como:

Drought
Freshwater lens
Saltwater intrusion
Sea-level rise
Atoll
Reef island
Water security
ENSO
El Niño

Faça o dropdown seguindo a mesma linguagem visual da aplicação.

---

# 7. MAPA GERAL DE TUVALU

A tela inicial deve reproduzir a composição do vídeo.

No canto superior esquerdo do mapa:

ISLAND OVERVIEW

Tuvalu · Pacific Ocean

As nove ilhas devem aparecer distribuídas aproximadamente de acordo com sua posição geográfica relativa no arquipélago.

Não é necessário desenhar toda a costa real nessa visão inicial.

Essa tela deve funcionar como um mapa esquemático elegante.

Cada ilha deve possuir:

- pequeno desenho do atol/ilha;
- contorno amarelo-claro;
- nome;
- classificação abaixo;
- hover;
- estado selecionado;
- cursor indicando interatividade.

Exemplo:

Nanumea
Atoll

Nanumaga
Reef island

etc.

No canto superior direito da área do mapa coloque uma observação discreta equivalente a:

Miniatures show island type and relative position, not exact coastlines.

---

# 8. INTERAÇÃO COM AS ILHAS

Ao passar o mouse sobre uma ilha:

- aumentar levemente o brilho;
- aumentar discretamente sua escala;
- destacar o nome;
- mudar o cursor;
- usar uma transição curta e elegante.

Ao clicar:

NÃO navegue para outra página.

Faça uma transição dentro da própria aplicação.

A câmera deve parecer "entrar" naquela ilha.

Depois carregue a visualização territorial 3D correspondente.

Utilize transições suaves.

Evite simplesmente esconder um componente e mostrar outro instantaneamente.

---

# 9. VISUALIZAÇÃO 3D DA ILHA

Este é um dos requisitos mais importantes.

Cada ilha deve possuir um modelo baseado em sua GEOGRAFIA REAL.

Obtenha coastline/polígono real através de dados geográficos confiáveis.

Pode utilizar, quando apropriado:

OpenStreetMap
Natural Earth
OpenStreetMap coastline data
GeoJSON público
Overpass
ou outra fonte aberta confiável.

Crie arquivos GeoJSON locais dentro do projeto sempre que possível.

Não faça dezenas de requisições externas sempre que a aplicação abrir.

Pré-processe e armazene os dados necessários.

---

# 10. TERRITÓRIO REAL

O formato da ilha apresentado em 3D deve corresponder ao máximo possível à costa real.

Isso é especialmente importante para ilhas como:

Funafuti
Vaitupu
Nukufetau
Nui
Nukulaelae
Nanumea

Não represente Funafuti como uma elipse genérica.

A forma longa e estreita do território deve ser perceptível.

O mesmo vale para as outras ilhas.

---

# 11. ESTILO DO 3D

Visualmente siga o vídeo.

A cena deve ter aparência de:

miniatura territorial;
maquete científica;
mapa 3D;
cartografia interativa.

O oceano deve permanecer teal/ciano.

O terreno pode ter tons claros e dessaturados.

Edificações devem ser discretas.

Vegetação pode utilizar pequenos modelos simplificados.

Não crie um jogo realista.

A prioridade é leitura geográfica.

Entretanto, a geometria territorial precisa ser real.

---

# 12. MODO SATÉLITE

Além da aparência estilizada do vídeo, prepare a arquitetura para permitir uma camada:

Satellite

Ela deve mostrar imagens reais/satélite da ilha quando uma fonte compatível estiver configurada.

O projeto não pode quebrar caso nenhuma API paga esteja configurada.

Crie:

MAP_STYLE=MODEL
MAP_STYLE=SATELLITE

ou implementação equivalente.

Sem token externo, a aplicação deve funcionar perfeitamente usando o modo MODEL.

Nunca coloque API keys diretamente no código.

Use variáveis de ambiente.

---

# 13. EDIFICAÇÕES

Quando houver footprints disponíveis no OpenStreetMap, utilize-os.

Transforme polígonos de edifícios em pequenas extrusões 3D.

Não é necessário reproduzir a altura real de todos os prédios.

Alturas podem ser aproximadas quando não existirem dados.

A legenda deve mostrar:

Buildings
X mapped footprints

---

# 14. VEGETAÇÃO

Represente vegetação utilizando elementos leves.

Por exemplo:

pequenas árvores estilizadas;
pontos de vegetação;
polígonos existentes;
vegetação procedural controlada.

A legenda deve mostrar:

Vegetation
X representative trees

Deixe claro quando forem elementos representativos e não inventário real.

---

# 15. NÍVEL DO MAR

O nível do mar deve responder à timeline.

Não altere permanentemente a geometria da ilha de forma aleatória.

Crie uma camada de água cuja elevação possa mudar.

Para projeções futuras, permita valores como:

+X cm central projection

Visualmente, a água deve avançar sobre áreas extremamente baixas quando pertinente.

Como Tuvalu possui relevo muito baixo, utilize exagero vertical apenas quando necessário para legibilidade.

Se utilizar exaggeration, deixe isso indicado discretamente.

---

# 16. CONTROLES DA CÂMERA

A cena 3D deve permitir:

arrastar → orbitar;

scroll → zoom;

pinch → zoom;

clique direito + arrastar → pan;

touch equivalente em dispositivos móveis.

Coloque uma pequena faixa de instruções semelhante ao vídeo:

Drag to orbit · wheel or pinch to zoom · right-drag to pan

Inclua:

Reset view

Esse botão deve restaurar posição, zoom e rotação originais da câmera.

---

# 17. INTERFACE DO MODO ILHA

No canto superior esquerdo:

← All islands

Abaixo:

ATOLL
ou
REEF ISLAND

Nome gigante da ilha.

Exemplo:

Vaitupu

O nome deve aparecer grande e parcialmente transparente sobre a cena, como no vídeo.

Abaixo coloque um pequeno card:

MEAN SEA-LEVEL LAYER

Historical context

ou, no futuro:

+62 cm central projection
2090 range: ...

O conteúdo dependerá da timeline.

---

# 18. LEGENDA DA CENA

No canto superior direito da área 3D coloque um pequeno painel escuro:

□ Buildings
X mapped footprints

● Vegetation
X representative trees

● Sea level
Historical context

ou:

Sea level
+62 cm central projection

A legenda precisa responder à ilha e ao período selecionados.

---

# 19. DISCLAIMER CARTOGRÁFICO

No canto inferior esquerdo da visualização 3D coloque uma pequena observação semelhante:

Real coastline, roads and building footprints from OpenStreetMap. Vegetation is representative. Vertical scale and sea-level movement may be exaggerated for legibility. This is not a parcel-level inundation map.

Adapte o texto conforme as fontes realmente utilizadas.

Não faça alegações falsas sobre precisão científica.

---

# 20. TIMELINE

A timeline deve permanecer fixa na parte inferior durante praticamente toda a experiência.

Ela deve existir tanto no mapa geral quanto dentro das ilhas.

Use os pontos:

2007
2011
2022
Now
2030
2050
2090

Se fizer sentido para os dados, permita alterar esses períodos através de um arquivo de configuração.

Visual:

linha horizontal fina;
círculos nos anos;
círculo selecionado preenchido em coral/vermelho;
anos abaixo;
ano ativo em destaque.

O comportamento deve ser próximo ao vídeo.

À esquerda:

← Previous

À direita:

Next →

Os botões devem alterar o período selecionado.

O usuário também pode clicar diretamente nos pontos.

---

# 21. REGRA FUNDAMENTAL DA TIMELINE

Quando uma ilha estiver selecionada:

MUDAR O ANO NÃO PODE RETORNAR PARA O MAPA GERAL.

A ilha deve permanecer selecionada.

Somente os seguintes elementos devem mudar:

- nível do mar;
- estado climático;
- vegetação quando aplicável;
- indicadores;
- conteúdo do painel lateral;
- projeções;
- observações;
- destaque visual.

A mensagem inferior pode reforçar:

Select an island, then move through time without leaving it.

---

# 22. PAINEL LATERAL

O painel lateral ocupa aproximadamente 28% da largura.

Background amarelo-creme.

Ele deve possuir scroll independente quando o conteúdo for grande.

O resto da tela não deve rolar.

No início do painel:

categoria pequena:

HISTORICAL EVENT

ou:

CURRENT CONDITIONS

ou:

FUTURE SCENARIO

Depois:

ano enorme.

Exemplo:

2007

Abaixo:

Vaitupu · Atoll

Depois:

título editorial grande.

Exemplo:

Water security became a national priority.

Depois:

subtítulo curto.

Depois:

Learn more +

Ao abrir:

Learn more −

O painel expande detalhes SEM esconder o mapa.

---

# 23. SEÇÕES DO LEARN MORE

As informações devem ser estruturadas aproximadamente assim:

WATER

FOOD

DAILY LIFE

RESPONSE

EVIDENCE

SOURCE TYPE

Cada bloco deve possuir texto curto e legível.

Para cada ilha, contextualize os efeitos localmente.

Exemplo:

Funafuti possui características urbanas e densidade de infraestrutura muito diferentes de Niulakita.

Isso deve aparecer nos textos.

---

# 24. INFORMAÇÕES ESPECÍFICAS POR ILHA

Crie uma estrutura semelhante a:

IslandData {
    id
    name
    type
    coordinates
    area
    population
    description
    geography
    freshwater
    droughtVulnerability
    saltwaterIntrusion
    settlements
    infrastructure
    buildings
    vegetation
    sources

    timeline: {
        2007: {...},
        2011: {...},
        2022: {...},
        now: {...},
        2030: {...},
        2050: {...},
        2090: {...}
    }
}

Cada período pode possuir:

headline
summary
water
food
dailyLife
response
evidence
sourceType
seaLevel
droughtStatus
vegetationModifier
waterStress
scenarioType
sources

Não espalhe essas informações hardcoded em componentes React.

Centralize os dados.

---

# 25. EVENTOS NACIONAIS + CONTEXTO LOCAL

Alguns eventos podem ser nacionais.

Exemplo:

uma política nacional de segurança hídrica.

Nesse caso:

o headline pode ser nacional;

MAS o painel deve apresentar também uma seção:

ON THIS ISLAND

explicando como aquilo afeta especificamente:

Funafuti,
Vaitupu,
Nanumea,
etc.

Assim evitamos mostrar nove vezes exatamente o mesmo conteúdo.

---

# 26. PASSADO, PRESENTE E FUTURO

Diferencie claramente:

HISTORICAL OBSERVATION

CURRENT DATA

FUTURE SCENARIO

Nunca apresente projeções de 2050 ou 2090 como acontecimentos confirmados.

Adicione no painel, quando necessário:

FUTURE SCENARIO

This is a scenario, not an exact prediction.

A aparência pode seguir a caixa vermelha observada no vídeo.

---

# 27. CARREGAMENTO DO MODELO

Quando uma ilha for aberta pela primeira vez, mostre um pequeno estado de loading dentro da cena:

Building Vaitupu

Reading coastline and building footprints...

Pode possuir spinner minimalista.

Carregue assets de forma assíncrona.

Evite congelar a interface.

Depois faça fade do loading.

---

# 28. TRANSIÇÕES

A aplicação deve possuir transições sutis.

Mapa geral → ilha:

aproximação;
fade;
zoom;
movimento de câmera.

Mudança de timeline:

transição do nível do mar;
fade dos textos;
alteração progressiva dos indicadores.

Ilha → mapa geral:

zoom-out / fade reverso.

Não utilize animações exageradas.

---

# 29. STACK

Utilize:

Next.js
TypeScript
React

Para 3D:

Three.js
React Three Fiber
@react-three/drei

Para geoprocessamento:

Turf.js

Quando necessário:

GeoJSON
TopoJSON

CSS:

Tailwind CSS ou CSS Modules.

Prefira uma implementação limpa e controlável.

Não instale bibliotecas enormes se forem desnecessárias.

---

# 30. ARQUITETURA

Organize aproximadamente assim:

src/
  app/
  components/
    Header/
    ClimateTerms/
    TuvaluOverview/
    IslandMarker/
    IslandScene/
    IslandTerrain/
    BuildingsLayer/
    VegetationLayer/
    SeaLevelLayer/
    Timeline/
    InfoPanel/
    MapLegend/
    CameraControls/
    LoadingIsland/
  data/
    islands/
    timeline/
    sources/
  hooks/
  lib/
    geo/
    climate/
  types/

public/
  data/
    geojson/
      nanumea.geojson
      nanumaga.geojson
      niutao.geojson
      nui.geojson
      vaitupu.geojson
      nukufetau.geojson
      funafuti.geojson
      nukulaelae.geojson
      niulakita.geojson

Não precisa seguir exatamente os nomes acima se existir uma arquitetura melhor.

Mas preserve a separação entre:

UI
dados
geografia
renderização 3D
lógica climática.

---

# 31. PERFORMANCE

A aplicação precisa rodar de maneira fluida.

Utilize:

lazy loading;
memoização;
instanced meshes para árvores;
geometrias simplificadas quando necessário;
LOD;
cache de dados;
suspense;
preload da próxima ilha quando possível.

Não renderize milhares de objetos React individualmente.

Utilize instancing.

O mapa geral deve carregar imediatamente.

O 3D pode carregar sob demanda.

---

# 32. RESPONSIVIDADE

Desktop é prioridade e deve ser extremamente próximo ao vídeo.

Em telas menores:

não tente comprimir mapa e painel lado a lado até ficarem ilegíveis.

Tablet:

pode reduzir o painel lateral.

Mobile:

mapa em cima;
painel como drawer/bottom sheet;
timeline adaptada horizontalmente;
controles touch adequados.

A experiência desktop não pode ser sacrificada para facilitar mobile.

---

# 33. ESTADOS DA APLICAÇÃO

Utilize algo equivalente a:

selectedIsland
selectedYear
learnMoreOpen
mapMode
cameraState
layers
isLoading

Exemplo:

mapMode:
overview
island

selectedIsland:
null | islandId

selectedYear:
2007 | 2011 | 2022 | now | 2030 | 2050 | 2090

A URL também pode refletir o estado:

/?island=funafuti&year=2050

Isso deve permitir compartilhar diretamente uma visualização.

---

# 34. FONTES

Inclua uma área de sources/references.

Não invente dados.

Priorize fontes como:

Tuvalu Government
UN
UNICEF
WHO
World Bank
IPCC
SPREP
NASA
NOAA
OpenStreetMap
Copernicus
artigos científicos relevantes.

Cada informação importante deve conseguir apontar para uma fonte.

Não é necessário poluir a interface com citações gigantes.

Use links discretos no painel expandido.

---

# 35. DETALHE IMPORTANTE SOBRE PRECISÃO

Separe claramente:

dados observados;
dados cartográficos;
representações visuais;
projeções;
simulações.

Por exemplo:

árvores procedurais NÃO representam a localização real de cada árvore.

Altura exagerada do terreno NÃO representa altitude exata.

A camada de aumento do nível do mar NÃO deve ser descrita como mapa de inundação parcel-level caso não exista modelagem adequada.

---

# 36. NÃO FAZER

Não criar uma landing page.

Não criar hero section.

Não utilizar cards enormes.

Não colocar o mapa dentro de um card.

Não colocar bordas arredondadas em tudo.

Não substituir o 3D por uma imagem estática.

Não usar imagens falsas de ilhas.

Não usar modelos 3D aleatórios.

Não criar apenas Funafuti e reutilizar o mesmo modelo para as outras ilhas.

Não deixar os botões sem funcionamento.

Não criar elementos apenas para aparência.

Todas as interações mostradas precisam funcionar.

---

# 37. EXPERIÊNCIA ESPERADA

Ao abrir o site:

vejo imediatamente o arquipélago de Tuvalu.

Vejo nove pequenas representações das ilhas.

Vejo uma timeline.

Vejo um grande evento climático/histórico no painel direito.

Clico em Vaitupu.

A interface aproxima a ilha.

Aparece um modelo 3D com o formato real de Vaitupu.

Posso girar.

Posso aproximar.

Posso mover a câmera.

Vejo edificações e vegetação.

Mudo de 2007 para 2050.

A ilha permanece na tela.

O nível do mar muda suavemente.

O painel lateral muda.

As informações agora falam especificamente sobre Vaitupu e sobre aquele cenário.

Clico em:

All islands

Volto para o arquipélago.

Clico em Funafuti.

Agora vejo a geometria real de Funafuti, muito diferente de Vaitupu.

A timeline continua funcionando.

Esse fluxo deve funcionar para todas as nove ilhas.

---

# 38. CRITÉRIOS DE ACEITAÇÃO

Considere o projeto pronto somente quando:

1. As nove ilhas aparecerem no mapa geral.
2. Todas forem clicáveis.
3. Cada uma abrir seu próprio território 3D.
4. As geometrias forem baseadas em dados geográficos reais.
5. A câmera 3D permitir orbit, zoom e pan.
6. "Reset view" funcionar.
7. "All islands" funcionar.
8. Previous e Next funcionarem.
9. Todos os pontos da timeline forem clicáveis.
10. Alterar o ano não retirar o usuário da ilha selecionada.
11. O painel lateral responder ao ano.
12. O painel lateral responder à ilha.
13. Learn more abrir e fechar.
14. O painel possuir scroll independente.
15. Nível do mar responder aos períodos.
16. A legenda mostrar os layers atuais.
17. Edificações forem carregadas quando existirem dados.
18. Vegetação for renderizada de forma eficiente.
19. O site permanecer em tela cheia.
20. O layout desktop estiver visualmente muito próximo do vídeo.
21. Não existirem botões falsos.
22. Não existirem TODOs visíveis.
23. Não existirem placeholders genéricos quando o projeto for entregue.
24. `npm run build` terminar sem erro.
25. O console não apresentar erros.
26. O site funcionar mesmo sem API paga.

---

# 39. ORDEM DE IMPLEMENTAÇÃO

Não tente fazer tudo superficialmente ao mesmo tempo.

Primeiro examine cuidadosamente o vídeo de referência.

Depois:

FASE 1
Reproduza layout e identidade visual com precisão.

FASE 2
Crie o mapa geral e as nove ilhas.

FASE 3
Implemente seleção e transição de ilha.

FASE 4
Implemente apenas uma ilha completa em 3D, preferencialmente Vaitupu.

FASE 5
Implemente câmera, buildings, vegetation e sea level.

FASE 6
Implemente timeline.

FASE 7
Implemente painel de informações.

FASE 8
Generalize o sistema para as outras oito ilhas.

FASE 9
Adicione dados e fontes.

FASE 10
Refine animações e responsividade.

FASE 11
Compare novamente com o vídeo e corrija diferenças visuais.

---

# 40. INSTRUÇÃO FINAL

Não quero apenas um protótipo demonstrativo.

Construa a aplicação de verdade.

Tome decisões técnicas quando necessário sem me interromper para questões pequenas.

Se alguma parte da referência não puder ser reproduzida literalmente, preserve primeiro:

1. estrutura;
2. comportamento;
3. proporções;
4. identidade visual;
5. sensação de navegação.

O vídeo anexado deve ser continuamente usado como referência durante o desenvolvimento.

A experiência final deve transmitir imediatamente a sensação de estar usando o mesmo "Tuvalu Time Machine" mostrado no vídeo, mas com uma melhoria essencial:

cada ilha deve possuir sua própria geografia real, conteúdo próprio e visualização 3D navegável.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
