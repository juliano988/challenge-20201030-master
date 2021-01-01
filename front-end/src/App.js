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
      pagSelecionada: '',
      alimentoSelecionado: [],
      dominio: 'https://challenge-20201030-master.juliano988.repl.co'
    };

    this.loadingDivRef = React.createRef();
    this.id01Ref = React.createRef();
  }

  componentDidMount() {
    fetch(this.state.dominio + '/products/?p=1')
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
    fetch(this.state.dominio + '/products/?p=' + this.state.pagSelecionada)
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

  hadleClickLinhaTabela(e) {
    this.setState({
      alimentoSelecionado: e
    });
    this.id01Ref.current.style.display = 'block';
  }

  hadleClickCloseModal() {
    this.id01Ref.current.style.display = 'none';
  }

  render() {
    return (
      <div id='app'>
        <Loading app={this} />
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
              {/* Apenas por questões de semântica... */}
              <thead><tr><th>Imagem</th><th>Nome</th></tr></thead>
              <tbody>
                <LinhasTabela app={this} resultados={this.state.resultados} />
              </tbody>
            </table>
          </div>
          <div id="selecionar-pagina">
            <label id="label-pagina">Pagina:</label>
            <input id="input-pagina" type="number" onChange={this.handleChangeBusca.bind(this)} value={this.state.pagSelecionada} placeholder={this.state.totalPaginas + ' páginas'}></input>
            <p>{this.state.paginaAtual + '/' + this.state.totalPaginas}</p>
            <button id="buscar-pagina-btn" onClick={this.handleClickBusca.bind(this)}>Buscar</button>
          </div>
        </div>
        <Modal app={this} alimentoSelecionado={this.state.alimentoSelecionado} />
      </div>
    );
  }
}

function Loading(props) {
  const app = props.app;
  return (
    <div id="loading-div" ref={app.loadingDivRef}>
      <div role="status">
        <span>Loading...</span>
      </div>
    </div>
  );
}

function LinhasTabela(props) {
  const app = props.app;
  const resultados = props.resultados;
  let linhasTabela = resultados.map(function (val, i) {
    return (
      <tr id={'linha-' + i} key={'l' + i} onClick={app.hadleClickLinhaTabela.bind(app, resultados[i])}>
        <td id={'col-' + i + '-0'} key={'c' + i + '-0'}>
          <img id={'foto-' + i} src={val.image_url} alt={val.product_name} />
        </td>
        <td id={'col-' + i + '-1'} key={'c' + i + '-1'}>
          <p id={'link-' + i}>{val.product_name || "Não disponível"}</p>
        </td>
      </tr>
    );
  }
  );
  return linhasTabela;
}

function Modal(props) {
  const app = props.app;
  const alimentoSelecionado = props.alimentoSelecionado;

  return (
    <div id="id01" ref={app.id01Ref} className="w3-modal">
      <div className="w3-modal-content w3-animate-left">
        <header className="w3-container w3-teal">
          <span onClick={app.hadleClickCloseModal.bind(app)}
            className="w3-button w3-display-topright">&times;</span>
          <h2 id="modal-header">{alimentoSelecionado.product_name || "Não disponível"}</h2>
        </header>
        <div className="w3-container">
          <img id="imagem-alimento-modal" src={alimentoSelecionado.image_url} alt={alimentoSelecionado.product_name} />
          <p><b>Codigo de barras:</b></p>
          <p id="modal-barcode">{alimentoSelecionado.barcode || "Não disponível"}</p>
          <p><b>Status:</b></p>
          <p id="modal-status">{alimentoSelecionado.status || "Não disponível"}</p>
          <p><b>Paking:</b></p>
          <p id="modal-packaging">{alimentoSelecionado.packaging || "Não disponível"}</p>
          <p><b>Brands:</b></p>
          <p id="modal-brands">{alimentoSelecionado.brands || "Não disponível"}</p>
          <p><b>Store:</b></p>
          <p id="modal-store">{alimentoSelecionado.store || "Não disponível"}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
