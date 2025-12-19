// Variáveis Globais:
const gridSizeX = 10;
const gridSizeY = 10;

var posicaoX = 9;
var posicaoY = 4;

var vidas = 3;

var rios = [ 6, 8];
var balsa = [ 5, 4 ];
var direcao = [ 1, -1 ];

var estradas = [1, 2, 3];
var carro = [1, 5, 8];
var direcaoCarro = [1, -1, 1];

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
        if (posicaoX < (gridSizeX-1) && !novaPosicao.classList.contains("azul") && !novaPosicao.classList.contains("carro"))
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
        if (posicaoY < (gridSizeY-1) && !novaPosicao.classList.contains("azul") && !novaPosicao.classList.contains("carro"))
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
        if (posicaoX > 0 && !novaPosicao.classList.contains("azul") && !novaPosicao.classList.contains("carro"))
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
        if (posicaoY > 0 && !novaPosicao.classList.contains("azul") && !novaPosicao.classList.contains("carro"))
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
            elem.classList.remove("verde");
            if (balsa[cont_rio] == i)
                elem.classList.add("amarelo");
            else
                elem.classList.add("azul");
        }
    });

    // Criar estradas
    estradas.forEach((estrada, cont_estrada) => {
        for(let i = 0; i < gridSizeY; i++)
        {
            let elem = document.querySelector("#bloco"+estrada+i);
            elem.classList.remove("verde");
            if (carro[cont_estrada] == i)
                elem.classList.add("carro");
            else
                elem.classList.add("asfalto");
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
            divNovo.classList.add("verde");
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
setInterval(movimentaCarros, 500);


function movimentaBalsas() {
    rios.forEach((rio, i) => {
        let colAtual = balsa[i];
        let bAtual = document.querySelector("#bloco" + rio + colAtual);
        let jogadorNaBalsa = jogadorEstaNaBalsa(rio, colAtual);

        balsa[i] += direcao[i];
        if (balsa[i] === 0 || balsa[i] === gridSizeY - 1) {
            direcao[i] *= -1;
        }

        let colNova = balsa[i];
        let bNova = document.querySelector("#bloco" + rio + colNova);

        bAtual.classList.remove("amarelo");
        bAtual.classList.add("azul");
        bNova.classList.remove("azul");
        bNova.classList.add("amarelo");

        if (jogadorNaBalsa) {
            let jAtual = document.querySelector("#bloco" + posicaoX + posicaoY);
            let jNovo = document.querySelector("#bloco" + posicaoX + colNova);

            jAtual.classList.remove("jogador");
            jNovo.classList.add("jogador");
            posicaoY = colNova;
        }
    });
}

function movimentaCarros() {
    estradas.forEach((estrada, i) => {

        let colAtual = carro[i];
        let cAtual = document.querySelector("#bloco" + estrada + colAtual);

        carro[i] += direcaoCarro[i];
        if (carro[i] === 0 || carro[i] === gridSizeY - 1) {
            direcaoCarro[i] *= -1;
        }

        let colNova = carro[i];
        let cNova = document.querySelector("#bloco" + estrada + colNova);

        cAtual.classList.remove("carro");
        cAtual.classList.add("asfalto");

        if (posicaoX === estrada && posicaoY === colNova) {
            cNova.classList.add("vermelho");
            removeVida();
            return;
        }

        cNova.classList.remove("asfalto");
        cNova.classList.add("carro");
    });
}



