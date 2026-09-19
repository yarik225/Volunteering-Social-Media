/*
    SHS Volunteering Project - Profile Fetching JS Code
    Copyright (C) 2026  Tyler Yeh

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/></name>
*/

/*
    Fetch profile JS functions - BETA - unstable, for testing only
*/

// Internal function - parse InnerView profile page
/**
 * @param {string} pageHTML The HTML content of the profile page
 * @returns {object} Returns the error (boolean error and Error object errorObj) and user error (string or null userError) as well as the profile information.
 */
function parseInnerViewProfilePage(pageHTML) {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(pageHTML, "text/html");

    // Validate that this is a profile page by checking the title
    if(!parsedDocument.title.toLowerCase().startsWith("innerview - member profile")) {
        return {
            error: true,
            errorObj: new Error("The username provided lead to a page that is not a profile page."),
            userError: "The username you provided lead to a page that is not a profile page.",
            data: null
        };
    }

    // Find the HTML elements the data is stored in
    const metaOgTitleEl = parsedDocument.querySelector("meta[name='og:title']");
    const userProfileTitleEl = parsedDocument.querySelector(".user-profile-information-title");
    const hoursCountEl = parsedDocument.querySelector(".hours_count.verification_type_total");
    const userProfileAvatarEl = parsedDocument.querySelector(".user-profile-avatar");

    // Validate that the elements exist
    if(!metaOgTitleEl || !userProfileTitleEl || !hoursCountEl || !userProfileAvatarEl || !userProfileAvatarEl.children.length) {
        return {
            error: true,
            errorObj: new Error("Error parsing profile page. Some or all of the expected HTML elements of the profile page are not present. The parser code might need to be updated, or something else occurred."),
            userError: "We were able to load your profile page, but we encountered an error while trying to process it.",
            data: null
        }
    }

    const userProfileAvatarLinkEl = userProfileAvatarEl.children[0];

    // Extract the information
    let errorExtractingInfo = false;

    // Extract the user's full name
    const sInnerViewString = metaOgTitleEl.content;
    const sInnerViewStringParts = sInnerViewString.match(/(.+)\'s innerview/i);
    let userFullName;

    if(sInnerViewStringParts.length === 2 && !!sInnerViewStringParts[1]) {
        userFullName = sInnerViewStringParts[1];
    } else {
        errorExtractingInfo = true;
    }

    // Extract the user's nickname (First Name, Last Initial)
    const userNickname = userProfileTitleEl.textContent;
    if(!userNickname) {
        errorExtractingInfo = true;
    }

    // Extract the user's number of volunteer hours
    const numVolunteerHours = parseFloat(hoursCountEl.textContent);
    if(isNaN(numVolunteerHours)) {
        errorExtractingInfo = true;
    }

    // Extract the user profile avatar URL
    const bgImageCSS = userProfileAvatarLinkEl.style.backgroundImage;
    let userProfilePictureURL;
    if(bgImageCSS) {
        const bgImageParts = bgImageCSS.match(/url\([\"\'']([^\"]+)[\"\']\)/i);
        if(bgImageParts.length === 2) {
            userProfilePictureURL = bgImageParts[1];
        } else {
            errorExtractingInfo = true;
        }
    } else {
        errorExtractingInfo = true;
    }

    // Return error if there was an error extracting info
    if(errorExtractingInfo) {
        return {
            error: true,
            errorObj: new Error("Error extracting information from profile page. Some or all of HTMl elements had unexpected values and/or the values failed to validate."),
            userError: "We were able to load your profile page, but we encountered an error while trying to process it.",
            data: null
        };
    }

    // All good! No errors at all extracting info.
    // Now let's return it.
    return {
        error: false,
        errorObj: null,
        userError: null,
        data: {
            fullName: userFullName,
            nickname: userNickname,
            profilePictureURL: userProfilePictureURL,
            numVolunteerHours
        }
    };
}

// Use corsproxy.io to fetch the profile information
// NOTICE - corsproxy.io doesn't work, we need a different backend.
/**
 * @param {string} innerViewUsername
 * @returns {object} The profile information as an object, if able to fetch profile. The `error` key-value pair tells you whether there was an error. The userError key-value pair is either null or a string, and it is the error string to present to the end user.
 */
async function fetchInnerViewProfile(innerViewUsername) {
    const urlToFetch = `https://corsproxy.io/?url=${encodeURIComponent("https://innerview.org/" + encodeURIComponent(innerViewUsername))}`;

    try {
        const response = await fetch(urlToFetch);
        if(!response.ok) {
            if(response.status === 404) {
                return {
                    error: true,
                    userError: "The profile was not found.",
                    errorObject: new Error("The innerview profile was not found. HTTP 404."),
                    data: null
                };
            } else {
                throw new Error("An unknown HTTP error occured: " + response.status + " " + response.statusText);
            }
        }

        const text = await response.text();

        const profilePageInfo = parseInnerViewProfilePage(text);
        return profilePageInfo;
    } catch(err) {
        return {
            error: true,
            errorObject: err,
            userError: "Something went wrong while trying to fetch the InnerView profile.",
            data: null
        };
    }
}