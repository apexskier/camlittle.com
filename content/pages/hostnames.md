---
title: Hostnames
url: /hostnames/
menu: 
  main:
    parent: about
tags: ["tech"]
---

I've been using a system for naming my devices for several years now, starting when I learned about computer naming schemes at ResTek[^1]. I've taken inspiration from [RFC 1178 - "Choosing a Name for Your Computer"](https://tools.ietf.org/html/rfc1178)[^2].

This page exists to document my current and historical names.

I name each of my computers after [Washington rivers](https://www.americanwhitewater.org/content/River/state-summary/state/WA/) and try to group them by device type via the starting letter.

| Name | Description | Year acquired | Active |
| ---- | ----------- | ------------- | ------ |
| Chehalis | work MacBook Pro (15-inch, 2019) | 2019 |
| Chelan | work MacBook Pro 15” (late 2016) | 2016 |
| Chinook | work MacBook Pro (16-inch, 2019) | 2020 | ✅ |
| Chiwawa | work MacBook Pro (16-inch, 2021) | 2022 | ✅ |
| Dungeness | iPhone 5 | 2012 |
| Dungeness | iPhone 6S | 2015 |
| Dungeness | iPhone Xs | 2018 |
| Dungeness | iPhone 12 mini | 2021 | ✅ |
| Elwha | iMac (refurbished) 21.5"/3.20/2X2G/1TB/5670/SD-USA | 2011 |
| Glacier | DigitalOcean Debian development server | 2013 |
| Matheny | DigitalOcean droplet | 2019 | ✅ |
| Methow | DigitalOcean droplet | 2014 |
| Nisqually | MacBook Pro (13-inch, 2019, Four Thunderbolt 3 ports) | 2019 | ✅ |
| Nooksack | MacBook Pro 13” (late 2013) | 2014 |
| Queets | iPad Pro 10.5” (2017) | 2017 | ✅ |
| Quinault | iPad (2012) | 2012 |
| Sauk | Raspberry Pi |
| Sitkum | Raspberry Pi (HomeKit server) |
| Skagit | Raspberry Pi |
| Soleduc | Raspberry Pi |

I've also started naming non-computers after bodies of water

| Name | Description | Year acquired | Active |
| ---- | ----------- | ------------- | ------ |
| Crescent | Seagate 4TB drive | 2013 | ✅ |
| Padden | DigitalOcean Kubernetes cluster | 2019 |
| Sutherland | Backblaze B2 bucket | 2019 | ✅ |

<script>
// adapted from https://stackoverflow.com/a/49041392/2178159

const getCellValue = (tr, i) => tr.children[i].innerText || tr.children[i].textContent;

const comparer = (i, asc) => (a, b) => ((v1, v2) => 
    v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, i), getCellValue(asc ? b : a, i));

document.querySelectorAll("th").forEach(function sorter(th, thi) {
    th.style.cursor = "pointer";
    th.role = "button";
    th.tabIndex = 0;
    let asc = Array.from(th.parentNode.children).indexOf(th) === 0; // first column is already sorted
    const sort = () => {
        const tbody = th.closest("table").querySelector("tbody");
        Array.from(tbody.querySelectorAll("tr"))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), asc = !asc))
            .forEach(tr => tbody.appendChild(tr) );
    }
    th.addEventListener("click", sort);
    th.addEventListener("keydown", (e) => {
        if (e.code == "Enter" || e.code == "Space") {
            e.preventDefault();
            sort();
        }
    });
});
</script>

[^1]: When I worked there, the server admins had started using Norse gods, and apparently a previous generation had used Sesame Street characters.

[^2]: Yep, there's an RFC for this. Another great one is [RFC 1855](https://tools.ietf.org/html/rfc1855)
