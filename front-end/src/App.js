import React from 'react';

import './styles.scss';
import './w3-modal.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paginaAtual: 0,
      totalPaginas: 0,
      qResultados: 0,
      resultados: [],
      pagSelecionada: ''
    };

    this.loadingDivRef = React.createRef();

    this.handleChangeBusca = this.handleChangeBusca.bind(this);
    this.handleClickBusca = this.handleClickBusca.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8080/products/?p=1')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            paginaAtual: result.pagina_atual,
            totalPaginas: result.total_paginas,
            qResultados: result.q_resultados,
            resultados: result.resultados
          });
          this.loadingDivRef.current.setAttribute('style', 'display: none')
        },
        (error) => {
          console.log(error);
        });
  };

  handleChangeBusca(e) {
    if (e.target.value < 0 || e.target.value === '' || e.target.value === '-') {
      this.setState({
        pagSelecionada: ''
      });
    } else if (e.target.value >= this.state.totalPaginas) {
      this.setState({
        pagSelecionada: this.state.totalPaginas
      });
    } else {
      this.setState({
        pagSelecionada: e.target.value
      });
    }
  }

  handleClickBusca() {
    this.loadingDivRef.current.setAttribute('style', 'display: flex')
    fetch('http://localhost:8080/products/?p=' + this.state.pagSelecionada)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            paginaAtual: result.pagina_atual,
            totalPaginas: result.total_paginas,
            qResultados: result.q_resultados,
            resultados: result.resultados
          });
          this.loadingDivRef.current.setAttribute('style', 'display: none')
        },
        (error) => {
          console.log(error);
        });
  }

  render() {
    const resultados = this.state.resultados;
    let linhasTabela = resultados.map(function (val, i) {
      return (
        <tr id={'linha-' + i} code={val.code}>
          <td id={'col-' + i + '0'}>
            <img id={'foto-' + i} src={val.image_url} alt={val.product_name} />
          </td>
          <td id={'col-' + i + '1'}>
            <p id={'link-' + i}>{val.product_name}</p>
          </td>
        </tr>
      )
    }
    );
    return (
      <div id='app'>
        <div id="loading-div" ref={this.loadingDivRef}>
          <div role="status">
            <span>Loading...</span>
          </div>
        </div>
        <div id="main-div">
          <h1 id="titulo">Fitness Foods LC</h1>
          <h5 id="sub-titulo">Serviço de consulta nutricional</h5>
          <div id="cabecalho-tabela">
            <h5 id="titulo-tabela">Tabela de Produtos</h5>
            <h6 id="label-imagem-tabela">Imagem</h6>
            <h6 id="label-nome-tabela">Nome</h6>
          </div>
          <div id="janela-consulta">
            <table id="tabela-consulta">
              {linhasTabela}
            </table>
          </div>
          <div id="selecionar-pagina">
            <label id="label-pagina">Pagina:</label>
            <input id="input-pagina" type="number" onChange={this.handleChangeBusca} value={this.state.pagSelecionada} placeholder={this.state.totalPaginas + ' páginas'}></input>
            <p>{this.state.paginaAtual + '/' + this.state.totalPaginas}</p>
            <button id="buscar-pagina-btn" onClick={this.handleClickBusca}>Buscar</button>
          </div>
        </div>

        {/* Modal */}
        {/* <div id="id01" class="w3-modal">
          <div class="w3-modal-content w3-animate-left">
            <header class="w3-container w3-teal">
              <span onclick="document.getElementById('id01').style.display='none'"
                class="w3-button w3-display-topright">&times;</span>
              <h2 id="modal-header">Modal Header</h2>
            </header>
            <div class="w3-container">
              <img id="imagem-alimento-modal" />
              <p><b>Codigo de barras:</b></p>
              <p id="modal-barcode"></p>
              <p><b>Status:</b></p>
              <p id="modal-status"></p>
              <p><b>Paking:</b></p>
              <p id="modal-packaging"></p>
              <p><b>Brands:</b></p>
              <p id="modal-brands"></p>
              <p><b>Store:</b></p>
              <p id="modal-store"></p>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
