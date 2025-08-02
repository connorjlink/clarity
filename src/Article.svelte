<script lang="ts">

</script>

<style>
    .container {
        display: none;
        flex-direction: column;
        justify-content: center;
        font-family: Georgia;
        width: 700px;
        max-width: 50%;
        margin: auto;
    }
        .container hr {
            border: none;
            border-top: 1px solid var(--dark-background-e);
            margin: 2rem 0;
        }
        .container p {
            line-height: 1.5rem;
        }
        .container code {
            white-space: nowrap;
        }
        .container ArticleHeader {
            font-family: var(--global-font);
            margin: 1rem auto 2rem auto;
        }
</style>

<div class="container">
    <slot name="header">
        <h1>Anonymous Article</h1>
    </slot>
    <slot name="content">
        <p>Whoops! This article is a work-in-progress.</p>
    </slot>
    <slot name="footer">
        <span>Source code available at <a href="https://github.com/connorjlink/clarity">https://github.com/connorjlink/clarity</a>.</span>
        <br>
        <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
    </slot>
</div>
