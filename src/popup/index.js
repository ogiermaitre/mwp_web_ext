import { map, forEach } from 'rambda'
import { select } from 'd3-selection'

import '@/assets/style/style.less'
import '@assets/style/style.css'
import '@assets/style/popup.less'

const projects = [
    { code: 'fr', name: 'French' },
    { code: 'en', name: 'English' },
]

const getAPIInfos = (prj, title) => {
    const url = `https://${prj}.wikipedia.org/w/api.php?action=query&format=json&prop=redirects|langlinks&titles=${title}&rdlimit=499&lllimit=300`
    return fetch(url)
        .then(d => d.json())
        .then(d => {
            const id = Object.keys(d.query.pages)[0]
            const { redirects, langlinks: ll } = d.query.pages[id]

            const langlinks = map(e => ({
                code: e.lang,
                title: e['*'],
                url: `https://${e.lang}.wikipedia.org/wiki/${e['*']}`,
            }), ll)
            return { id, redirects, langlinks }
        })
}

const buttons = (selector, status = false) => {
    let currentStatus = status

    const plusButton = select(selector).select('button.plus')
    const minusButton = select(selector).select('button.minus')
    const list = select(selector).select('ul')

    const refreshVisibility = () => {
        plusButton.property('disabled', currentStatus)
        minusButton.property('disabled', !currentStatus)

        list.style('display', currentStatus ? 'block' : 'none')
    }

    plusButton.on('click', () => {
        currentStatus = true
        refreshVisibility()
    })
    minusButton.on('click', () => {
        currentStatus = false
        refreshVisibility()
    })

    refreshVisibility()
    return {
    }
}

const tabs = (headerSelector, tabSelectors, defaultTab = 0) => {
    let currentTab = defaultTab
    const headerNode = select(headerSelector)
    const tabNodes = map(d => select(d), tabSelectors)

    const refreshTab = () => {
        forEach(d => d.style('display', 'none'), tabNodes)
        tabNodes[currentTab].style('display', null)
    }

    headerNode.selectAll('button').on('click', (d, i) => {
        console.log(`click on ${i}`)
        currentTab = i

        refreshTab()
    })

    refreshTab()
}

const idTab = () => {
    // init project
    const selectNode = select('#pageproject')
    const inputNode = select('#pageid')
    const prjSel = selectNode.selectAll('option').data(projects, d => d.code)
    prjSel.enter().append('option').attr('value', d => d.code).text(d => d.name)

    // TODO: we should check if pageid is valid, whenever the input or the select change.

    select('#gotowikipedia').on('click', () => {
        const project = selectNode.select('option:checked').attr('value')
        const pageid = inputNode.property('value')

        const url = `https://${project}.wikipedia.org?curid=${pageid}`
        const creating = browser.tabs.create({ url })
    })
}

const wpUrlRe = new RegExp('http.://([a-z]+)\\.wikipedia\\.org/wiki/(.*)')
const titleNode = select('#pagetitle')
const redirections = select('#redirections')
const langlinks = select('#langlinks')

browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
    // TODO: we should find the title, event when the url uses ?curid=234554
    // TODO: we should also handle the case where the current URL is not a wikipedia page (display tab2)
    if (tabs.length === 1) {
        const [{ url }] = tabs
        const m = wpUrlRe.exec(url)
        if (m) {
            const [, project, title] = m

            titleNode.select('span.title').text(title.replace(/_/g, ' '))

            getAPIInfos(project, title)
                .then(d => {
                    titleNode.select('span.id').text(d.id)

                    redirections.select('div.title > span.counter').text(d.redirects.length)
                    langlinks.select('div.title > span.counter').text(d.langlinks.length)

                    // populate redirection list
                    const liRedSel = redirections.select('ul').selectAll('li').data(d.redirects, d => `${project}_${d.id}`)
                    liRedSel.enter().append('li').text(d => d.title)
                    const liLL = langlinks.select('ul').selectAll('li').data(d.langlinks, d => `${project}_${d.id}`)
                    liLL.enter().append('li').text(d => d.title)
                })
        }
    }
})

const redirectionButton = buttons(redirections.node())
const langlinksButton = buttons(langlinks.node())

const t = tabs('#tabheader', ['div.tab1', 'div.tab2'], 1)
const idt = idTab()
