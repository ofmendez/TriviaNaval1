
export function InsertElement(tagToAdd, listClasses, content, targetParent, nameId ) {
    // Create element
    const el = document.createElement(tagToAdd);
    
    // Add classes to element
    el.classList.add(...listClasses);
    
    if( nameId !==undefined)
        el.id = nameId
    // Set the innerHTML of the element
    el.innerHTML = content;
    // Or add text content to element
    // el.textContent = content;
    // add element to DOM
    targetParent.appendChild(el);
    return el;
}


export function RandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function ConmuteClassAndInner(element, c1, c2, in1){
    element.classList.add(c1)
    element.classList.remove(c2)
    element.innerHTML = in1
}

export function AnimateWithTransparent(el1, el2, interval) {
    document.body.classList.add('avoidEvents');

    el1.setAttribute('transparent',true);
    el2.setAttribute('transparent',true);

    setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, interval);
    setTimeout(() => { el1.setAttribute('transparent',true); el2.setAttribute('transparent',true);}, interval*2);
    setTimeout(() => { el1.removeAttribute('transparent'); el2.removeAttribute('transparent');}, interval*3);
    setTimeout(() => { 
        el1.setAttribute('transparent',true); el2.setAttribute('transparent',true); 
        document.body.classList.remove('avoidEvents');
    }, interval*4);
}

export function emailToId(email) {
    return email.replace(/@/g, ' at ').replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '');
}

