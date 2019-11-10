var emojis = ['😠','😦','😑','😀','😍'];

$("#emojiHome").mousemove(function(){
	var i = $(this).val();
    $(".emoji").html(emojis[i]);
    console.log(i)
});

function proximoCodigo() {
  let codigo = 0; // para o código começar do 1
  let scodigo = localStorage.getItem("proximoCodigo");
  // console.log(scodigo);
  if (scodigo != null) codigo = parseInt(scodigo) + 1;
  localStorage.setItem("proximoCodigo", codigo);
  return codigo;
}

// Ordena os lançamentos
function desenhaDiario(ordem) {
  let diario = JSON.parse(localStorage.getItem("diario")); // Converte JSON para um Objeto JS

  if (ordem == null || ordem == 1)
    // ordem de código
    diario.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
  // ordem de data
  else diario.sort((a, b) => new Date(a.data) - new Date(b.data));

  // Desenha a tabela
  let tela = "";
  let nota = 0;
  diario.forEach(d => {
    // saldo += l.nota;
    nota += d.nota;
    data = new Date(d.data);
    tela +=
      "<tr>" +
      "<td>" +
      data.getDate() +
      "/" +
      (data.getMonth() + 1) +
      "/" +
      data.getFullYear() +
      "</td>" +
      "<td>" +
      d.descricao +
      "</td>" +
      "<td>" +
      '<div class="emojiHistory">' + emojis[d.nota-1]+ '</div>' +
      "</td>" +
      "<br>" +
      // Passa o código da td para o id do botão
      "<td>" +
      "<button" +
      (d.codigo != null
        ? ' id="' +
          d.codigo +
          '"' +
          ' class="editar btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"'
        : "") +
      'type="submit">Editar</button>' +
      '<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered" role="document">' +
      ' <div class="modal-content">' +
      '<div class="modal-header">' +
      '<h5 class="modal-title" id="exampleModalLongTitle">Editando</h5>' +
      '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
      '<span aria-hidden="true">&times;</span>' +
      "</button>" +
      "</div>" +
      '<div class="modal-body">' +
      "<form>" +
      '<div class="form-group">' +
      '<label for="editar-descricao">Descrição</label>' +
      '<input type="text" class="form-control" id="descricaoInput" placeholder="">' +
      "</div>" +
      '<div class="form-group">'+
      '<form>'+
      '<div>'+
      '<div class="rate">'+
      '<div class="emoji"></div>'+
      '<input id="emojiHistory" name="inlineRadioOptions" type="range" min="0" max="4" step="1">'+
      '</div>'+
      "</div>" +
      "</form>" +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
      '<button type="submit" id="excluirRegistro" class="btn btn-danger" data-dismiss="modal">Excluir</button>' +
      '<button type="submit" id="submitRegistro" class="btn btn-primary">Save changes</button>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
  });
  $("#tela").html(tela);
}

function desenhaMedia() {
    let diario = JSON.parse(localStorage.getItem("diario")); // Converte JSON para um Objeto JS
    let nota = 0;
    diario.forEach(d => {
    nota += d.nota;
    })
    let media = parseInt(nota/diario.length);
    let emoji = '<div class="emoji">' + emojis[media]+ '</div>'; 
    $("#media").html(emoji);
    };

// Home
$(document).ready(() => {
  salvaDiario()
  desenhaMedia()
  desenhaDiario();
  function salvaDiario() {
    // Carrega o vetor de lançamentos
    let diario = JSON.parse(localStorage.getItem("diario")); // Converte JSON para um Objeto JS
    if (!diario || diario == null) {
      var data = Date.now();
      diario = [
        {
          codigo: proximoCodigo(),
          data: data,
          descricao:
            "Hoje o meu dia foi bom. Eu e a minha mãe conversamos e comemos juntos. Agora à noite estou realizando um trabalho da pós graduação.",
          nota: 5
        }
      ];
      localStorage.setItem("diario", JSON.stringify(diario));
    }
  }
  salvaDiario();

  // Configuração dos botões
  $("#ordenaCodigo").click(() => {
    desenhaDiario(1);
  });

  $("#ordenaData").click(() => {
    desenhaDiario(2);
  });

  // Envia um novo lançamento
  $("#enviarRegistro").click(e => {
    e.preventDefault();
    let novoDia = {
      codigo: proximoCodigo(),
      data: Date.now(),
      descricao: $("#descricao").val(),
      nota: parseInt($("input").val()) +1
    };
    let diario = JSON.parse(localStorage.getItem("diario"));
    diario.push(novoDia);
    localStorage.setItem("diario", JSON.stringify(diario));
    //  desenhadiario(diario);
    window.location.reload();
  });

  $(".editar").click(e => {
    // pega o id do botão que é o mesmo que o código
    let thisCodigo = e.target.id;
    let thisList = JSON.parse(localStorage.getItem("diario"));
    let thisDescricao = thisList[thisCodigo].descricao;
    let thisNota = thisList[thisCodigo].nota;

    $(".emoji").html(emojis[thisNota-1]);

    $("#emojiHistory").change(function(){
        var i = $(this).val();
        $(".emoji").html(emojis[i]);
        console.log(i)
    });

    // passa os notaes atuais para os placeholders dos inputs
    $("#descricaoInput").attr("placeholder", thisDescricao);
    $("#notaInput").attr("placeholder", thisNota);

    // envia o lancamento editado
    $("#submitRegistro").click(e => {
      e.preventDefault();
      // pega os novos notaes,
      let descricaoInput = $("#descricaoInput").val();
      let notaInput = parseInt($("input").val()) +1;
      console.log(notaInput);
      // se estiverem vazios, mantém o nota atual, se não, passa o nota digitado
      descricaoInput
        ? (thisList[thisCodigo]["descricao"] = descricaoInput)
        : (thisList[thisCodigo]["descricao"] = thisDescricao);
      notaInput
        ? (thisList[thisCodigo]["nota"] = notaInput)
        : (thisList[thisCodigo]["nota"] = thisNota);
      localStorage.setItem("diario", JSON.stringify(thisList));
      // alert("Editado!");
      window.location.reload();
    });

    $("#excluirRegistro").click(e => {
      e.preventDefault();
      // tira o lançamento na posição especificada
      // (a posição no vetor é a mesma que o número do id)
      thisList.splice(thisCodigo, 1);

      // incrementa os códigos posteriores para manter a mesma
      // ordem do vetor
      for (i = thisCodigo; i < thisList.length; i++) {
        thisList[i].codigo = parseInt(i);
      }

      // decrementa o código no localstorage
      // para o próximo item a ser adicionado ficar na ordem do vetor
      let codigo = JSON.parse(localStorage.getItem("proximoCodigo"));
      localStorage.setItem("proximoCodigo", JSON.stringify(--codigo));

      localStorage.setItem("diario", JSON.stringify(thisList));
      alert("Excluido!");
      window.location.reload();
    });
  });
});
