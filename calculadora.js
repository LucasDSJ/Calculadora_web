document.addEventListener("DOMContentLoaded", function() {
    const telaResultado = document.getElementById("telaResultado");
    const botoes = document.querySelectorAll("button");
    let resultadoNaTela = false;

    // ---------------------- FUNÇÕES AUXILIARES ---------------------- //

    function ultimoCaracter() {
        return telaResultado.textContent.trim().slice(-1);
    }

    function ehOperador(valor) {
        return ["+", "-", "*", "/"].includes(valor);
    }

    function contarParenteses(texto) {
        return {
            abertos: (texto.match(/\(/g) || []).length,
            fechados: (texto.match(/\)/g) || []).length
        };
    }

    function podeInserirParenteses(botaoId, texto, ultimo) {
        const { abertos, fechados } = contarParenteses(texto);

        // IMPEDIR ) SEM ABRIR ANTES
        if (botaoId === ")" && abertos <= fechados) return false;

        // IMPEDIR ) DEPOIS DE OPERADOR OU VÍRGULA
        if (botaoId === ")" && (ehOperador(ultimo) || ultimo === ",")) return false;

        // IMPEDIR ( DEPOIS DE NÚMERO
        if (botaoId === "(" && !isNaN(ultimo)) return false;

        // IMPEDIR ( DEPOIS DE VÍRGULA
        if (botaoId === "(" && ultimo === ",") return false;

        // IMPEDIR ) COMO PRIMEIRO CARACTERE
        if (botaoId === ")" && texto === "0") return false;

        return true;
    }

    function limpar() {
        telaResultado.textContent = "0";
        resultadoNaTela = false;
    }

    function deletar() {
        let texto = telaResultado.textContent.trim();

        if (texto.length <= 1) {
            telaResultado.textContent = "0";
            return;
        }

        // REMOVE O OPERADOR COMPLETO, JUNTO COM OS ESPAÇOS (" " + " ")
        if (texto.endsWith(" ")) {
            telaResultado.textContent = texto.slice(0, -3);
        } else {
            telaResultado.textContent = texto.slice(0, -1);
        }
    }

    function calcular() {
        let resultado = telaResultado.textContent;
        resultado = resultado.replace(/,/g, ".");
        resultado = eval(resultado);
        telaResultado.textContent = resultado;
        resultadoNaTela = true;
    }

    function adicionarValor(botaoId) {
        let ultimo = ultimoCaracter();

        // VERIFICA SE COMEÇOU DO ZERO OU TEM RESULTADO NA TELA
        if (telaResultado.textContent == "0" || resultadoNaTela === true) {

            if (!isNaN(parseInt(botaoId)) || botaoId === ",") {
                telaResultado.textContent = botaoId;
            } else {
                telaResultado.textContent += " " + botaoId + " ";
            }

            resultadoNaTela = false;
            return;
        }

        // CASO NORMAL
        if (ehOperador(botaoId)) {
            telaResultado.textContent += " " + botaoId + " ";
        } else {
            telaResultado.textContent += botaoId;
        }
    }

    function bloquearDuplicacoes(botaoId, ultimo) {
        // BLOQUEAR VÍRGULA COMO PRIMEIRO A SER DIGITADO
        if (botaoId === "," && telaResultado.textContent === "0") return true;

        // BLOQUEAR OPERADOR OU VÍRGULA DUPLICADA (++, --, ///)
        if (ehOperador(botaoId) || botaoId === ",") {
            if (ehOperador(ultimo) || ultimo === ",") return true;
        }

        return false;
    }

    // ---------------------- EVENTOS DOS BOTÕES ----------------------

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {

            let texto = telaResultado.textContent.trim();
            let ultimo = ultimoCaracter();
            let id = botao.id;

            // DELETE
            if (id === "R") return deletar();

            // LIMPAR
            if (id === "C") return limpar();

            // "=" CALCULAR
            if (id === "=") return calcular();

            // BLOQUEIOS DE PARÊNTESES
            if (id === "(" || id === ")") {
                if (!podeInserirParenteses(id, texto, ultimo)) return;
            }

            // BLOQUEAR DUPLICAÇÕES
            if (bloquearDuplicacoes(id, ultimo)) return;

            // ADICIONAR VALOR NORMAL
            adicionarValor(id);
        });
    });

});
