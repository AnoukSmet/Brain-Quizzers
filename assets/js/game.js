const categorySelection = $('#category');

fetch("https://opentdb.com/api_category.php").then(res => res.json()).then(data => {
    const categories = data.trivia_categories;

    categories.forEach(category => {
        let optionField = `<option value="${category.id}">${category.name}</option>`;
        categorySelection.append(optionField);
    });

});

