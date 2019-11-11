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
  let collapse = 0;
  let show = 0;
  let heading = 0;
  let heading1 = 0;
  diario.forEach(d => {
    // saldo += l.nota;
    nota += d.nota;
    data = new Date(d.data);
    tela +=
    '<div class="container">'+
    '<div class="row justify-content-center">'+
    '<div class="col-sm-8 col-md-6">'+
    '<div class="accordion" id="accordionExample">'+
    '<div class="card">'+
    '<div class="card-header" id="heading'+heading++ + '"'+
    '<h2 class="mb-0">'+
    '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse'+collapse++ + '"' + 'aria-expanded="true" aria-controls="collapseOne">'+
    data.getDate()+"/" +(data.getMonth() + 1)+"/" +data.getFullYear() +' '+
    emojis[d.nota-1]+
    '</button>'+
    '</h2>'+
    '</div>'+
    '<div id="collapse'+show++ +'"' + 'class="collapse" aria-labelledby="heading'+heading1++ + '"' +'data-parent="#accordionExample">'+
    '<div class="card-body">'+
    d.descricao+
    '<div class="editarButton text-center m-t-10">'+
    "<button" + (d.codigo != null? ' id="' + d.codigo + '"' + ' class="editar btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"': "") +
    'type="submit">Editar</button>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>';
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
    let emoji = '<div class="emoji">' + 
    '<div class="container">' +
    '<div class="row justify-content-center">'+
    '<div class="col-sm-8 col-md-6 text-center">'+
    emojis[media]+ 
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>';

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
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          nota: 5
        }
      ];
      localStorage.setItem("diario", JSON.stringify(diario));
    }
  }


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
    // $("#registroInput").attr("placeholder", thisDescricao);
    // $("#notaInput").attr("placeholder", thisNota);

    // envia o lancamento editado
    $("#submitRegistro").click(e => {
      e.preventDefault();
      // pega os novos notaes,
      let registroInput = $("#registroInput").val();
      let notaInput =  parseInt($("#emojiHistory").val()) +1;

      // se estiverem vazios, mantém o nota atual, se não, passa o nota digitado
      registroInput
        ? (thisList[thisCodigo]["descricao"] = registroInput)
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
