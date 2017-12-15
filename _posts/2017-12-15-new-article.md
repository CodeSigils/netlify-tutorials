---
title: New article
slug: new-article
date: 2017-12-15T10:30:56.212Z
thumbnail: /images/uploads/63.jpg
excerpt: Lorem Ipsum...
layout: post
---
```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", function (user) {
      if (!user) {
        window.netlifyIdentity.on("login", function () {

          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
