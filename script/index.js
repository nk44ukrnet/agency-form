'use strict';

(function () {
    let countryInfo = [];

    fetch('https://restcountries.com/v3.1/all')
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(data => {
            countryInfo = data.map((item, idx) => {
                const obj = {
                    name: item.name.common,
                    phone: '',
                }
                if ((item.idd.suffixes && item.idd.suffixes[0]) && item.idd.root) obj.phone = `${item.idd.root}${item.idd.suffixes[0]}`;
                return obj;
            });
            countryInfo.sort((a, b) => {
                return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
            })
            insertCountryData(countryInfo);
        })
        .catch(err => {
            console.log(err);
        });

    const inputLocationParent = document.querySelector('.register-form__group_location'),
        inputLocation = document.querySelector('.register-form__input_location'),
        inputPhone = document.querySelector('.register-form__input_phone'),
        inputDropDown = document.querySelector('.register-form__input_location-dropdown'),
        activeClass = 'register-form__group_location_active';

    inputLocation.addEventListener('click', function (e) {
        inputLocationParent.classList.add(activeClass);
    });
    inputLocationParent.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.dataset.country) {
            let countryEl = inputDropDown.querySelectorAll('.country');
            countryEl.forEach(item => {
                item.classList.remove('country_selected');
                e.target.classList.add('country_selected');
                inputLocation.value = e.target.dataset.country;
                inputPhone.value = e.target.dataset.phoneCode + ' ';
                closeDropdown();
            })
        }
    })

    function insertCountryData(arr) {
        if (arr.length) {
            let stringHTML = '';
            countryInfo.forEach(item => {
                const {name, phone} = item;
                stringHTML += `<p data-country="${name}" class="country" data-phone-code="${phone}">${name}</p>`
            })
            inputDropDown.innerHTML = stringHTML;
        }
    }

    function dropDownSearch(e) {
        let val = e.target.value.trim().toLowerCase();
        const allCountries = inputDropDown.querySelectorAll('.country');
        if (allCountries) {
            allCountries.forEach(country => {
                country.hidden = false;
            })
            allCountries.forEach(country => {
                let countryFormatted = country.innerHTML.trim().toLowerCase();
                if (countryFormatted.indexOf(val) == -1) {
                    country.hidden = true;
                }
            })
        }
    }

    function closeDropdown() {
        inputLocationParent.classList.remove(activeClass);
    }

    document.body.addEventListener('click', closeDropdown);
    inputLocation.addEventListener('input', dropDownSearch);

})()