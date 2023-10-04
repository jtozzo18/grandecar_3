/**
 * Função para salvar os dados do cliente utilizando o LocalStorage
 */
function salvarVenda() {
    // Obtendo valores dos checkboxes
    let licenc = document.getElementById('licenc').checked;
    let ipva = document.getElementById('ipva').checked;
    let multas = document.getElementById('multas').checked;
    let mercosul = document.getElementById('mercosul').checked;

    // Obtendo os outros dados 
    let data = document.getElementById('data').value;
    let cod_cli = document.getElementById('cod_cli').value;
    let tipo_auto = document.getElementById('tipo_auto').value;
    let placa = document.getElementById('placa').value;
    let tipo_pag = document.querySelector('input[name="pag"]:checked').value;

    // Criando um objeto com os dados do cliente
    let cliente = {
        data: data,
        cod_cli: cod_cli,
        tipo_auto: tipo_auto,
        placa: placa,
        tipo_pag: tipo_pag,
        check_veiculo: {
            licenc: licenc,
            ipva: ipva,
            multas: multas,
            mercosul: mercosul
        },

    };

    // Criando o array de clientes
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Adicionando o cliente ao array de clientes
    clientes.push(cliente);

    // Salva a lista atualizada no LocalStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Atualizamos a tabela
    listarClientes();
}

function listarClientes() {
    //obtendo os dados
    let clientes = JSON.parse(localStorage.getItem('clientes')) || []
    //obtendo onde iremos inserir a tabela
    let tabela = document.getElementById('listagem')
    tabela.innerHTML = '' //limpamos a tabela
    //criamos uma tabela com HTML
    let table = document.createElement('table')
    table.className = 'table table-bordered'
    table.innerHTML = `<thead>
                         <tr class='table-success'>
                           <th>Data Venda</th>
                           <th>CPF / CNPJ</th>
                           <th>Tipo do Automovel</th>
                           <th>Placa Veiculo</th>
                           <th>Tipo de Pagamento</th>
                           <th>Check do Veículo</th>
                         </tr>
                      </thead>
                      <tbody>
                      </tbody>   
                      `
    //preenchendo a tabela com os dados do clientes                      
    let tbody = table.querySelector('tbody')

    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        let row = tbody.insertRow(i);

        // Formate os valores do objeto check_veiculo em uma string
        let checkVeiculo = formatarCheckVeiculo(cliente.check_veiculo);

        row.innerHTML = `
        <td>${cliente.data}</td>
        <td>${cliente.cod_cli}</td>
        <td>${cliente.tipo_auto}</td>
        <td>${cliente.placa}</td>
        <td>${cliente.tipo_pag}</td>
        <td>${checkVeiculo}</td>
        <td><button class='btn btn-danger' onclick="apagarCliente('${cliente.cod_cli}')">Apagar</button></td>
    `;
    }

    // Função para formatar os valores do objeto check_veiculo em uma string
    function formatarCheckVeiculo(check_veiculo) {
        let formattedCheck = '';

        if (check_veiculo.licenc) {
            formattedCheck += 'Licenciamento, ';
        }
        if (check_veiculo.ipva) {
            formattedCheck += 'IPVA, ';
        }
        if (check_veiculo.multas) {
            formattedCheck += 'Multas, ';
        }
        if (check_veiculo.mercosul) {
            formattedCheck += 'Placa Mercosul, ';
        }

        // Remova a vírgula final, se houver
        if (formattedCheck.endsWith(', ')) {
            formattedCheck = formattedCheck.slice(0, -2);
        }

        return formattedCheck;
    }


    tabela.appendChild(table)
}

//chamar a função logo que carregar a página
listarClientes()


function apagarCliente(cod_cli) {

    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes = clientes.filter(cliente => cliente.cod_cli !== cod_cli);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Atualiza a tabela de clientes
    listarClientes();
}

function formatarCPFouCNPJ(valor) {
    // Remove todos os caracteres não numéricos
    valor = valor.replace(/\D/g, '');

    // Verifica se CPF (11 díg) ou CNPJ (14 díg)
    if (valor.length === 11) {
        //  CPF
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
        // CNPJ
        valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return valor;
}

// campo de entrada codigo cliente
const cod_cliElement = document.getElementById('cod_cli');

cod_cliElement.addEventListener('input', function () {
    this.value = formatarCPFouCNPJ(this.value);
});

/* Atualizando o ano */
const ano = document.getElementById('ano')
const anoAtual = new Date().getFullYear()

ano.textContent = anoAtual