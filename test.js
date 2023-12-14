const url = "https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/255741600909794";

function generate(mainContainer) {
    let obj = {};
    let currentKey = null;
  
    function processElement(element) {
      let values = [];
  
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
  
        if (child.tagName) {
          const tagName = child.tagName.toLowerCase();
  
          if (tagName === 'p') {
            values.push(child.innerText.trim());
          } else if (tagName.startsWith('h')) {
            currentKey = child.innerText.trim();
            obj[currentKey] = [];
            // Recursively process the next sibling which contains the list
            processList(child.nextElementSibling);
            i++;
          } else {
            // Recursively process child elements
            // console.log("recursive call");
            const scrap = processElement(child);
            values.push(scrap);
          }
        }
      }
  
      return values.length > 0 ? values : element.textContent.trim();
    }
  
    function processList(listElement) {
      if (listElement && listElement.tagName.toLowerCase() === 'ul') {
        Array.from(listElement.children).forEach(li => {
          if (li.querySelector('.dm-attachment')) {
            const attachmentLink = li.querySelector('.dm-attachment__link');
            if (attachmentLink) {
              obj[currentKey].push({
                title: attachmentLink.innerText.trim(),
                link: attachmentLink.href
              });
            }
          } else {
            obj[currentKey].push(li.innerText.trim());
          }
        });
      }
      else if(listElement && listElement.tagName.toLowerCase() == 'p'){
        obj[currentKey].push(listElement.innerText.trim());
      }else if (listElement && listElement.tagName.toLowerCase() === 'dl') {
        Array.from(listElement.children).forEach(div => {
          if (div.classList.contains('govuk-summary-list__row')) {
            const keyElement = div.querySelector('.govuk-summary-list__key');
            const valueElement = div.querySelector('.govuk-summary-list__value');
    
            if (keyElement && valueElement) {
              const key = keyElement.innerText.trim();
              let value;
    
              // Check if the value is a list
              const ulElement = valueElement.querySelector('ul');
              if (ulElement) {
                value = Array.from(ulElement.querySelectorAll('li')).map(li => li.innerText.trim());
              } else {
                value = valueElement.innerText.trim();
              }
    
              obj[currentKey].push({ [key]: value });
            }
          }
        });
      }
    }
  
    processElement(mainContainer);
  
    return obj;
  }
  

const containernames = [".govuk-grid-row"];

for(let i=0; i<containernames.length; i++){
    let TotalDOMelement = document.querySelectorAll(containernames[i]);
    console.log(TotalDOMelement.length);
    for(let j=0; j<TotalDOMelement.length; j++){
        let DOMObject = TotalDOMelement[j];
        let data = generate(DOMObject);
        console.log(data); 
    }
}
