(function () {
    /**
     * logout function
     */
    function logOut() {
        window.location.replace('/logout');
    }

    /**
     * loading animation functions
     * @type {HTMLElement}
     */
    const loadingIndicator = document.getElementById("loading-indicator");

    function showLoadingIndicator() {
        loadingIndicator.style.display = "block";
    }

    function hideLoadingIndicator() {
        loadingIndicator.style.display = "none";
    }

    /**
     * model that handle the data from nasa
     */
    const requestData = function () {
        let date = new Date();

        // limit to the current date of today
        const datepicker = document.getElementById('date');
        const currentDateString = date.toISOString().substring(0, 10);
        datepicker.setAttribute('max', currentDateString);

        let end_date = formatDate();
        date.setDate(date.getDate() - 2);
        let start_date = formatDate();

        /**
         * make the date in dd/mm/yyyy format
         * @returns {string}
         */
        function formatDate() {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }

        /**
         * function for set the date from the calendar element in the website
         * @param event
         */
        function setDate(event) {
            const element = event.target;
            date = new Date(element.value);
            end_date = formatDate();
            date.setDate(date.getDate() - 2);
            start_date = formatDate();
            document.getElementById("ImagesFeed").innerHTML = "";
            displayImgFeed().then(res => {
                hideLoadingIndicator();
            }).catch(error => {
                console.log(error)
            });
            showLoadingIndicator();
        }

        /**
         * function that update the date
         */
        function updateDate() {
            date.setDate(date.getDate() - 1);
            start_date = end_date = formatDate();
            date.setDate(date.getDate() - 2);
            start_date = formatDate();
        }

        /**
         * function that load the modal of the image contain the image and the comment
         * @param elem
         */
        async function loadModal(elem) {
            elem.preventDefault();
            const date = elem.target.id;
            commentsData.getComment(date);
            const response = await fetch(`/home/loadModel/${date}`)
            let data = await response.json();
            if (data.sessionExpired) {
                window.location.replace('/logout');
                return;
            }
            document.getElementById("modalTitle").innerHTML = `${data["title"]} <i>${data["date"]}</i>`
            document.getElementById("modalImg").src = data["url"];
        }

        /**
         * function that get the data and return the modal html code
         * @param data
         * @returns {string}
         */
        function createHtml(data) {
            let html = "";
            let cover = "";
            data.slice().reverse().forEach((elem) => {
                if (elem["media_type"] === "image")
                    cover = `<img  class="img-fluid rounded mx-auto" src="${elem.url}" style="height:25em;width: auto max-width:100%" alt="...">`
                else
                    cover = `<iframe class="img-fluid rounded mx-auto" src="${elem.url}" style="height:25em;width: auto max-width:100%" ></iframe>`
                html += `<div class="row justify-content-center mb-3">
                            <div class="col-sm-10 col-md-8 col-lg-8 col-xl-6">
                            <div class="card mb-3 text-center bg-light">
                              <div class="card-body ">
                                <h5 class="card-title">${elem.title} - ${elem.date}</h5>
                                <div class="card mx-auto border-0 mb-3 bg-light"> ${cover}</div>
                                <p class="card-text ">${elem.explanation}</p>
                                <a data-bs-toggle="modal" data-bs-target="#test" href="/date/${elem.date}" role="button" id="${elem.date}" class="btn btn-primary comments" >
                                       Open and comment
                                </a>
                              </div>
                            </div>
                            </div>
                        </div>`
            })
            return html;
        }

        /**
         * function that display the image feed using fetch request from NASA api
         */
        async function displayImgFeed() {
            const response = await fetch(`/home/image/${start_date}/${end_date}`)
            let data = await response.json();
            data = createHtml(data);
            document.getElementById("ImagesFeed").innerHTML += data;
            document.querySelectorAll(".comments").forEach((item) => {
                item.addEventListener("click", loadModal);
            });
        }

        return {
            displayImages: displayImgFeed,
            update: updateDate,
            set: setDate,
            load: loadModal
        };
    }();

    /**
     * model that is responsible for the comments' data: post,get,delete
     */
    const commentsData = function () {
        let imgIndex = ''
        let timer;

        /**
         * function that post the comment and add event listener for the delete button for each comment
         * @param event
         */
        function postComment(event) {
            event.preventDefault();
            if (document.getElementById("addComment").value !== "") {
                const fetchPromise = fetch("/home/date", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        comment: document.getElementById("addComment").value.trim(),
                        date: imgIndex
                    })
                });

                Promise.all([fetchPromise])
                    .then((responses) => {
                        return responses[0].json();
                    }).then((json) => {
                    if (json.sessionExpired) {
                        window.location.replace('/logout');
                        return;
                    }
                    let date = json.date
                    if (date) {
                        clearTimeout(timer);
                        getComment(date)
                        document.getElementById("comment").insertAdjacentHTML("afterbegin", postToHtml(json));
                    } else {
                        console.log('Error: no imgId field found in the returned data');
                    }
                });
                document.getElementById("addComment").value = ""
            }
        }

        /**
         * function that get the imgIndex and present all the comments
         * @param imgId
         */
        function getComment(imgId) {
            imgIndex = imgId;
            fetch(`/home/date/${imgId}`)
                .then(response => response.json())
                .then(data => {
                    const htmlPromises = data.map(comment => postToHtml(comment));
                    return Promise.all(htmlPromises);
                })
                .then(htmls => {
                    document.getElementById("comment").innerHTML = "";
                    htmls.forEach(html => {
                        document.getElementById("comment").innerHTML += html;
                        document.getElementById("comment").addEventListener("click", deleteComment);

                    });
                })
                .catch(error => console.log(error));
            timer = setTimeout(() => {
                return getComment(imgIndex)
            }, 15000);
        }


        /**
         * function that get comment data and return the html string for the comment components
         * @param comment
         * @returns {string}
         */
        function postToHtml(comment) {
            let del = "";
            try {
                return fetch("/home/session")
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        // do something with the returned data
                        if (comment.email === data.email)
                            del = `<a class="btn btn-danger btn-sm" id=${comment.imgId} >delete</a>`;

                        return `<div class="card mb-1">
                                <div class="card-body">
                                 <span class="fw-bold">
                                    ${comment.userName}
                                 </span>
                                 <hr />
                                 <span>
                                      ${comment.comment}
                                 </span>
                                 <hr />
                                 <span>
                                       ${del}
                                 </span>
                               </div>
                          </div>`;
                    });
            } catch (error) {
                console.log("Error getting session email: ", error);
            }
        }

        /**
         * function that handle the delete button press
         * @param event
         */
        function deleteComment(event) {
            event.preventDefault()
            if (event.target.tagName === 'A') {
                fetch(`/home/del/${event.target.id}`, {method: 'DELETE'}).then(function (response) {
                    return response.json();
                }).then((json) => {
                    if (json.sessionExpired) {
                        window.location.replace('/logout');
                        return;
                    }
                    clearTimeout(timer);
                    getComment(imgIndex);
                })
                    .catch(function (error) {
                        console.log(error)
                    });
            }
        }

        /**
         * function that return the timer
         * @returns timer
         */
        function getTimer() {
            return timer;
        }

        return {
            getComment: getComment,
            postComment: postComment,
            getTimer: getTimer,
        }
    }();

    /**
     * event listeners for all the events in the programs
     */
    document.addEventListener("DOMContentLoaded", function () {
        requestData.displayImages().then(res => {
            hideLoadingIndicator()
        }).catch(error => {
            console.log(error)
        });
        showLoadingIndicator();
        document.getElementById("date").addEventListener("change", requestData.set);
        document.getElementById("sendComment").addEventListener("submit", commentsData.postComment)
        document.getElementById("logOut").addEventListener("click", logOut);
        window.addEventListener("scroll", () => {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
                requestData.update();
                requestData.displayImages().then(res => {
                    hideLoadingIndicator()
                }).catch(error => {
                    console.log(error)
                });
                showLoadingIndicator();
            }
        });
    });
})();
