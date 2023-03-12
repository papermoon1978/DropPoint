const booleanInput = (switchID, labelText, isChecked) =>
{
    if (isChecked)
        isChecked="checked=checked"
    else
        isChecked = "";

    let switchInput = document.createElement("div");
    switchInput.classList = "flex items-center justify-between w-full";

    switchInput.innerHTML = `
        <label
        for="${switchID}"
        class="text-base w-full text-gray-600 ml-3 dark:text-gray-400"
        >${labelText}</label
        >
        <input
        type="checkbox"
        id="${switchID}"
        ${isChecked}    
        class="relative shrink-0 w-11 h-6 bg-gray-100 checked:bg-none checked:bg-cyan-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent dark:bg-gray-700 dark:checked:bg-cyan-600 dark:focus:ring-offset-gray-800 before:inline-block before:w-5 before:h-5 before:bg-white checked:before:bg-cyan-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-cyan-200"
        />
    `;
    return switchInput;
};

const enumInput = (enumID, labelText, enumList, selectedVal) =>
{    
    let selectInput = document.createElement("div");
    selectInput.classList = "flex items-center justify-between w-full";

    selectInput.innerHTML = `
        <label
        class="text-base w-full text-gray-600 mx-3 dark:text-gray-400"
        for="${enumID}">
        ${labelText}
        </label>

        <select
        id="${enumID}"
        class="py-3 px-4 pr-9 block w-fit border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
        >
        ${enumList.map(
        (option) =>                
            `<option value="${option}" ${option === selectedVal ? "selected=selected" : ""}>${
            option[0].toUpperCase() + option.slice(1)
            }</option>`
        )}
        </select>
    `;

    return selectInput;
};

window.onload = async () =>
{    
    electron.fetchConfig();  
    electron.onConfigReceived(async (_event, value) =>
    {
        console.log(`Received configuration: ${value}`);
        const configResponse = JSON.parse(value);
        const configPath = configResponse.config.path;
    
        const response = await fetch(configPath);
        const configObj = await response.json();
        console.log(Object.entries(configObj));
        Object.entries(configObj).forEach(([key, value]) =>
        {        
            const configEntrySchema = configResponse.schema[key];
            if (configEntrySchema.type === "boolean")
            {        
                document
                    .querySelector(".settings-content")
                    .appendChild(booleanInput(key, configEntrySchema.title, value));
            }
            else if (configEntrySchema.type === "string" && configEntrySchema.enum)
            {
                document
                    .querySelector(".settings-content")
                    .appendChild(
                        enumInput(
                            key,
                            configEntrySchema.title,
                            configEntrySchema.enum,
                            value              
                        )
                    );
            }
        });
    });
};

document.querySelector(".apply").addEventListener("click", () =>
{
    electron.fetchConfig();  
    electron.onConfigReceived(async (_event, value) => {        
        const configResponse = JSON.parse(value);
        const configPath = configResponse.config.path;
    
        const response = await fetch(configPath);
        const configObj = await response.json();
        const schema = configResponse.schema;  

        let newSettings = [];
    
        Object.entries(configObj).forEach(([key, value]) =>
        {              
            let el = document.querySelectorAll(`#${key}`);
            if (el && el.length > 0)
            {
                let newValue;
                if (schema[key].type == "boolean")
                    newValue = el[0].checked;
                else if (schema[key].type == "string")
                    newValue = el[0].value;
                else
                    console.log(`received setting ${setting.key} of unknown type`);
                
                newSettings.push({key:key, value:newValue});            
            }
        });
        
        electron.saveConfig(newSettings);
        window.close();
    });
});

document.querySelector(".reset").addEventListener("click", () =>
{
    electron.resetConfig();
    window.close();
});
