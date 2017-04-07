/* global staff */

const $ = document.querySelector.bind(document)

// since we have configured the reshape loader to be able to load client-side
// templates out of the `views/templates` directory, we can require this as
// a javascript template as well as including it in our static views
const employeeTemplate = require('../../views/templates/page.sgr')
let currentPage = 0

// next/prev buttons simply increment `currentPage` and re-render the list
$('.next').addEventListener('click', () => {
  if (currentPage === staff.length) return
  renderPage(++currentPage)
})

$('.prev').addEventListener('click', () => {
  if (currentPage === 0) return
  renderPage(currentPage--)
})

// very simple render, just replaces the list with a new template reflecting
// the current page
function renderPage (page) {
  $('ul').innerHTML = employeeTemplate({ staff, page })
}
