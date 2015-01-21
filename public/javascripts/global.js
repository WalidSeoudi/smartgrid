var socket = io.connect('/')

var playerID

$(document).ready(function() {
  // Récupération data joueur
  updatePlayerView()

  // Recevoir message de décision
  socket.on('server decision message', function (message) {
      displayDecisionMessage(message)
  })

  // Recevoir nouvel objectif
  socket.on('server objective message', function (message) {
    if (message.joueur == 0 || message.joueur === playerData._id)
      displayObjectiveMessage(message)
  })

  // Recevoir nouvel event
  socket.on('server event message', function(message) {
    if (message.joueur == 0 || message.joueur === playerData._id)
      displayEventMessage(message)
  })

  // Recevoir message de déconnexion (admin)
  socket.on('server logout message', function(message){
    if (message.player === playerData._id)
      displayLogoutMessage(message)
  })

  socket.on('update view', function (message) {
    updatePlayerView()
  })
})

function updatePlayerView() {
  $.get('/players/data', function (data) {
    playerData = data
  }).done(function (response) {
    $("#valeur_argent").text(" " + playerData.money)
    $("#valeur_energie").text(" " + playerData.energy)
    $("#valeur_satisfaction").text(" " + playerData.satisfaction)
    $("#valeur_score").text(" " + playerData.score)
  })
}

function displayDecisionMessage(message) {
  var tableContent = '<div class="message decision">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Faites un choix</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.name + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="close" value="Close" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".close").click(function() {
    $(this).parent().remove()
  })
}

function displayObjectiveMessage(message) {
  var tableContent = '<div class="message objective">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Nouvel objectif !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="ok_obj" value="OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_obj").click(function() {
    $(this).closest('.message').remove()
  })
}

function displayEventMessage(message) {
  var tableContent = '<div class="message event">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Nouvel Évènement !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="ok_event" value="OK" />'
  tableContent += '<input type="button" id="not_ok_event" value="NOT OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_event").click(function() {
    $(this).closest('.message').remove()
    updatePlayer(message)
  })
}

function displayLogoutMessage(message) {
  var tableContent = '<div class="message logout">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Oups !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>Vous allez être déconnecté.</strong><br />'
  tableContent += 'L\'administrateur vient de forcer votre déconnexion.</p><br />'
  tableContent += '<input type="button" class="ok_event" value="OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_event").click(function() {
    $(this).closest('.message').remove()
    $.ajax({
      url: '/logout',
      type: 'POST',
      dataType: 'json',
    }).done(function( response ) {
      if (response.msg === 'done') {
        window.location.href = '/'
      }
    })
  })
}

function updatePlayer (message) {
  var playerEdit = playerData

    // Use AJAX to post the object to our editEvent service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(playerEdit),
      contentType : 'application/json',
      url: '/players/edit',
    }).done(function( response ) {
      // Check for successful (blank) response
      if (response.msg !== '') {
        // If something goes wrong, alert the error message that our service returned
        console.log('Error: ' + response.msg)
      }
    })
  }
