// Variáveis Globais:
const gridSizeX = 10;
const gridSizeY = 10;

var posicaoX = 9;
var posicaoY = 4;

var vidas = 3;

var rios = [ 1, 3, 6, 8];
var balsa = [ 2, 4, 6, 8 ];
var direcao = [ 1, -1, 1, -1 ];

function setDefaults()
{
    posicaoX = 9;
    posicaoY = 4;
    vidas = 3;
}

// Registro de eventos:
document.addEventListener('DOMContentLoaded', inicializaJogo);
document.addEventListener('keydown', processaTecla);

// Funções:

function removeVida()
{
    vidas--;
    if (vidas == 0)
    {
        // TODO: Falta limpar o div "ambiente"
        let ambiente = document.querySelector(".ambiente");
        ambiente.innerHTML = "";
        alert("Game over");
        inicializaJogo();
    }
    else
    {
        atualizaVidas();
    }
}

function processaTecla(evento)
{
    let atual = document.querySelector("#bloco"+posicaoX+posicaoY);
    atual.classList.remove("vermelho");

    if (evento.key == "ArrowDown")
    {
        let novaPosicao = document.querySelector("#bloco"+(posicaoX+1)+posicaoY);
        if (posicaoX < (gridSizeX-1) && !novaPosicao.classList.contains("azul"))
        {
            atual.classList.remove("jogador");
            novaPosicao.classList.add("jogador");
            posicaoX += 1;
        }
        else
        {
            atual.classList.add("vermelho");
            removeVida();
        }
    }
    else if (evento.key == "ArrowRight")
    {
        let novaPosicao = document.querySelector("#bloco"+posicaoX+(posicaoY+1));
        if (posicaoY < (gridSizeY-1) && !novaPosicao.classList.contains("azul"))
        {
            atual.classList.remove("jogador");
            novaPosicao.classList.add("jogador");
            posicaoY += 1;
        }
        else
        {
            atual.classList.add("vermelho");
            removeVida();
        }
    }
    else if (evento.key == "ArrowUp")
    {
        let novaPosicao = document.querySelector("#bloco"+(posicaoX-1)+posicaoY);
        // Posso ir para a nova posição?
        if (posicaoX > 0 && !novaPosicao.classList.contains("azul"))
        {
            atual.classList.remove("jogador");
            novaPosicao.classList.add("jogador");
            posicaoX -= 1;
        }
        else
        {
            atual.classList.add("vermelho");
            removeVida();
        }

    }
    else if (evento.key == "ArrowLeft")
    {
        let novaPosicao = document.querySelector("#bloco"+posicaoX+(posicaoY-1));
        if (posicaoY > 0 && !novaPosicao.classList.contains("azul"))
        {
            atual.classList.remove("jogador");
            novaPosicao.classList.add("jogador");
            posicaoY -= 1;
        }
        else
        {
            atual.classList.add("vermelho");
            removeVida();
        }
    }
    else
    {
        alert(evento.key);
    }
}

function atualizaVidas()
{
    let spanVidas = document.querySelector("#vidas");
    spanVidas.innerText = vidas;
}

function inicializaJogo()
{
    setDefaults();
    criaGrid();

    // Criar jogador
    let jogador = document.querySelector("#bloco"+posicaoX+posicaoY);
    jogador.classList.add("jogador");

    // Criar rios
    rios.forEach((rio, cont_rio) => {
        for(let i = 0; i < gridSizeY; i++)
        {
            let elem = document.querySelector("#bloco"+rio+i);
            elem.classList.remove("cinza");
            if (balsa[cont_rio] == i)
                elem.classList.add("amarelo");
            else
                elem.classList.add("azul");
        }
    });

    atualizaVidas();
}

function criaGrid()
{
    let ambiente = document.querySelector(".ambiente");

    for(let x = 0; x < gridSizeX; x++)
    {
        for(let y = 0; y < gridSizeY; y++)
        {
            let divNovo = document.createElement("div");
            divNovo.classList.add("bloco");
            divNovo.classList.add("cinza");
            divNovo.id = "bloco"+x+y;

            if (y == 0)
            {
                divNovo.classList.add("left");
            }
            if (x == 0)
            {
                divNovo.classList.add("top");
            }
            if (y == gridSizeY-1)
            {
                divNovo.classList.add("right");
            }
            if (x == gridSizeX-1)
            {
                divNovo.classList.add("bottom");
            }

            ambiente.appendChild(divNovo);
        }
    }
}

function jogadorEstaNaBalsa(rio, colunaBalsa) {
    return posicaoX === rio && posicaoY === colunaBalsa;
}

setInterval(movimentaBalsas, 1000);

function movimentaBalsas()
{
    rios.forEach((rio, index) => {

        let colunaAtual = balsa[index];
        let balsaAtual = document.querySelector("#bloco"+rio+colunaAtual);
        let jogadorNaBalsa = jogadorEstaNaBalsa(rio, colunaAtual);

        if (direcao[index] == 1)
        {
            balsa[index]++;
            if (balsa[index] == gridSizeY - 1)
                direcao[index] = -1;
        }
        else
        {
            balsa[index]--;
            if (balsa[index] == 0)
                direcao[index] = 1;
        }

        let novaColuna = balsa[index];
        let balsaNova = document.querySelector("#bloco"+rio+novaColuna);

        balsaAtual.classList.remove("amarelo");
        balsaAtual.classList.add("azul");
        balsaNova.classList.remove("azul");
        balsaNova.classList.add("amarelo");

        if (jogadorNaBalsa)
        {
            let jogadorAtual = document.querySelector("#bloco"+posicaoX+posicaoY);

            if (novaColuna < 0 || novaColuna >= gridSizeY)
            {
                jogadorAtual.classList.add("vermelho");
                removeVida();
                return;
            }

            let jogadorNovo = document.querySelector("#bloco"+posicaoX+novaColuna);

            jogadorAtual.classList.remove("jogador");
            jogadorNovo.classList.add("jogador");

            posicaoY = novaColuna;
        }
    });
}
