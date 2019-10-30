import Choices from 'choices.js';

require("choices.js/src/styles/base.scss")
require("choices.js/src/styles/choices.scss")

export default class BioToolsSelector {
    constructor(element_id, option={preset_id, preset_value}){

        this.dropdown_element = document.querySelector(element_id);
        let value_element_id = this.dropdown_element.dataset.hiddenId;
        this.value_element = document.querySelector(value_element_id);

        this.varlookupDelay = 100;
        this.lookupTimeout = null;
        this.lookupCache = {};    

        var config = {
            placeholder: true,
            placeholderValue: 'Search Biotools API',
            maxItemCount: 20,
            searchChoices: false,
            duplicateItemsAllowed: false,
            removeItemButton: true,
            shouldSort: false,
            noChoicesText: 'Start typing to query bio.tools',
            itemSelectText: '',
            searchFields: ['label', 'value']
        };
        if (option && option[preset_id] && option[preset_value]){
            config['choices'] = [{
                value: preset_id,
                label: preset_value,
                selected: true
            }]
        }

        this.selector = new Choices(this.dropdown_element, config);

        let self = this;

        this.dropdown_element.addEventListener('choice', function(event){
            self.value_element.setAttribute("data-value", event.detail.value);
            self.value_element.setAttribute("data-name", event.detail.label);
        });
        
        //When user types into the search area: query biotools or load from cache, and display results.
        this.dropdown_element.addEventListener('search', function(){
            clearTimeout(self.lookupTimeout);
            self.lookupTimeout = setTimeout(()=>{self.query({'q': self.selector.input.value})}, self.lookupDelay);
        });
        
    }

    static populateChoices(selector, returned_choices){
        var choices = []
        returned_choices.list.forEach(function(element){
            choices.push({ 
                value: element.biotoolsID,
                label: element.name,
                customProperties: {
                    element
                }
            })
        
        });
        selector.setChoices(choices, 'value', 'label', true);
    }

    /* params:
          q: query_param
          operation: operation_param
    */
    query(query){

        const base_url = 'https://bio.tools/api/tool/?format=json&sort=score';
        const selector = this.selector;
        let query_url = false;

        if (query['q']){
            query_url = base_url + '&q=' + query['q'];
        } else if (query['operation']) {
            query_url = base_url + '&operation=' + query['operation'];
        }
        if (query_url){
            if (query_url in this.lookupCache) {
                BioToolsSelector.populateChoices(selector, this.lookupCache[query_url]);
            } else {
                self = this
                fetch(query_url)
                    .then(function(response) {
                        response.json().then(function(data) {
                            self.lookupCache[query_url] = data;
                            BioToolsSelector.populateChoices(selector, data);
                        });
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            }
        }
    }
}

//Set root to be whatever context this is running in
let root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global ||
  this ||
  {};

//Attach class to context
root.BioToolsSelector = BioToolsSelector;
