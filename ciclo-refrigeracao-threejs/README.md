# Simulação de Ciclo de Refrigeração em Three.js

Este projeto é uma visualização 3D interativa do ciclo de refrigeração de um sistema de ar condicionado do tipo Chiller com água gelada, construído com HTML, CSS e JavaScript puro, utilizando a biblioteca Three.js.

## Descrição do Ciclo Termodinâmico

A simulação demonstra as quatro fases principais do ciclo de refrigeração e o circuito de água gelada:

1.  **Compressão:** O gás refrigerante a baixa pressão é comprimido, tornando-se um gás quente de alta pressão.
2.  **Condensação:** O gás quente passa pelo condensador, onde troca calor com o ambiente (ar ou água de uma torre de resfriamento) e se condensa, tornando-se um líquido de alta pressão.
3.  **Expansão:** O líquido de alta pressão passa por uma válvula de expansão, que reduz drasticamente sua pressão e, consequentemente, sua temperatura.
4.  **Evaporação:** O refrigerante frio e de baixa pressão entra no evaporador (chiller), onde absorve o calor da água que circula em um circuito separado. Ao absorver calor, o refrigerante evapora, e a água do circuito secundário gela.

A água gelada é então bombeada para as Unidades de Tratamento de Ar (AHUs ou Fancoils), onde resfria o ar do ambiente antes de retornar ao evaporador para ser resfriada novamente, completando o ciclo.

## Captura de Tela da Simulação

(Placeholder para a captura de tela da simulação em funcionamento)

![Placeholder da Simulação](https://via.placeholder.com/800x450.png?text=Simulação+do+Ciclo+de+Refrigeração)

## Como Rodar Localmente

Para executar este projeto, você precisa de um servidor web local para servir os arquivos. Isso é necessário devido às políticas de segurança dos navegadores (CORS) ao carregar módulos JavaScript.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) instalado (que inclui o npm).

### Passos

1.  **Clone ou baixe este repositório:**
    ```bash
    # (Comando para clonar, se estivesse no GitHub)
    # git clone https://github.com/seu-usuario/ciclo-refrigeracao-threejs.git
    # cd ciclo-refrigeracao-threejs
    ```

2.  **Instale um servidor simples:**
    Se você não tiver um, pode instalar o `serve` globalmente via npm:
    ```bash
    npm install -g serve
    ```

3.  **Inicie o servidor:**
    Na pasta raiz do projeto (`ciclo-refrigeracao-threejs`), execute o comando:
    ```bash
    serve .
    ```

4.  **Abra no navegador:**
    Abra seu navegador e acesse o endereço fornecido pelo `serve` (geralmente `http://localhost:3000`).

### Alternativa (VS Code)

Se você usa o Visual Studio Code, pode instalar a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) e clicar em "Go Live" no canto inferior direito do editor para iniciar um servidor local.

---

## Como Implantar no GitHub Pages

Você pode hospedar esta simulação gratuitamente usando o GitHub Pages.

1.  **Crie um repositório no GitHub:**
    Crie um novo repositório público na sua conta do GitHub.

2.  **Envie os arquivos do projeto:**
    Adicione os arquivos deste projeto ao repositório que você acabou de criar.
    ```bash
    git init
    git add .
    git commit -m "Commit inicial do projeto de simulação"
    git branch -M main
    git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
    git push -u origin main
    ```
    *Lembre-se de substituir `SEU-USUARIO` e `SEU-REPOSITORIO` pelos seus dados.*

3.  **Ative o GitHub Pages:**
    - No seu repositório no GitHub, vá para **Settings** > **Pages**.
    - Na seção "Build and deployment", em "Source", selecione **Deploy from a branch**.
    - Em "Branch", selecione `main` e a pasta `/ (root)`.
    - Clique em **Save**.

4.  **Acesse a simulação:**
    Aguarde alguns minutos para a implantação ser concluída. Sua simulação estará disponível em:
    `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`
