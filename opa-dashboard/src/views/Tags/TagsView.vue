<template>
    <div class="tags">
        <div class="spinner-container" v-if='isLoading'>
            <fulfilling-bouncing-circle-spinner
            :animation-duration="2000"
            :size="60"
            color="#0B3954"
            />
        </div>

        <div class="page-heading">
            <img src="./../../assets/tag.svg" alt="" />
            <span> Tags </span>
        </div>

        <div class="page-body">
            <form @submit.prevent="submitForm">
                <span>v</span>
                <input type="text" v-model="tag.major" placeholder="Major version" required />
                <span>.</span>
                <input type="text" v-model="tag.minor" placeholder="Minor version" required />
                <span>.</span>
                <input type="text" v-model="tag.patch" placeholder="Patch version" required />
                <button type="submit">Create Tag</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import { FulfillingBouncingCircleSpinner } from 'epic-spinners';

const url = process.env.VUE_APP_BASE_URL + 'tags';
const config = {
    headers: {
        "ngrok-skip-browser-warning": "true",
    }
}

interface tagResponse{
    tags: string[],
    newTag: string
}
/**
 * A component to create a new tag and publish it to the project repository
 * @displayName Tags View
 */
export default defineComponent({
    components:{
        FulfillingBouncingCircleSpinner
    },

    data() {
        return {
            /**
             * An object to store the tag version entered by the user in the individual fields
             * @model
             */
            tag: {
                major: '',
                minor: '',
                patch: ''
            },
            /**
             * An array to store the existing tags sent by the backend.
             * Used to perform client side validation to check if the tag already exists
             * @model
             */
            existingTags: [] as string[],
            /**
             * A boolean to show the spinner when the page is loading
             * @model
             */
            isLoading: true
        }
    },
    methods: {
        /**
         * A method to submit the form and create a new tag
         * @public
         */
        async submitForm() {
            this.isLoading = true
            // check if the tag already exists, if it does, notify the user
            const tagVersion = `v${this.tag.major}.${this.tag.minor}.${this.tag.patch}`;
            if (this.existingTags.includes(tagVersion)) {
                this.$notify({
                    title: 'Error',
                    text: `Tag ${tagVersion} already exists`,
                    type: 'error'
                });
                return;
            }
            try {
                const response = await axios.post(url, { tag: tagVersion }, config);
                console.log(response);
                this.$notify({
                    title: 'Success',
                    text: `Tag ${tagVersion} created successfully`,
                    type: 'success'
                });
            } catch (error: any) {
                let message = ''
                if (error.response) {
                    message = error.response.data.message;
                } else {
                    message = error.message;
                }
                console.log(error);
                this.$notify({
                    title: 'Error',
                    text: `${message}`,
                    type: 'error'
                });
            } finally {
                this.isLoading = false
            }
        },
        /**
         * A method to get the existing tags from the backend.
         * Also returns the expected tag number to be created next and sets it in the tag object
         * @public
         */
        async getTags() {
            this.isLoading = true
            try{
                const response = await axios.get(url, config);
                this.existingTags = response.data.tags;
                console.log(response);
                const newTag = response.data.newTag;
                const tagArray = newTag.split('.');
                this.tag.major = tagArray[0].slice(1);
                this.tag.minor = tagArray[1];
                this.tag.patch = tagArray[2];
            } catch (error: any) {
                let message = ''
                if (error.response) {
                    message = error.response.data.message;
                } else {
                    message = error.message;
                }
                console.log(error);
                this.$notify({
                    title: 'Error',
                    text: `${message}`,
                    type: 'error'
                });
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted() {
        this.getTags();
    }
});
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.tags {
  top: 0;
  padding: 3em;
  width: 100%;
  height: 100%;
  font-size: 62.5%;
}

.page-heading {
  display: flex;
  align-items: center;
  padding: 0.4em 0;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 1em;
}

.page-heading span {
  font-size: 2rem;
}

.page-heading img {
  width: 6em;
  height: 6em;
  margin: 0 3em;
}

.page-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

form {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

form input {
    height: 2em;
    margin: 0 0.5em;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 5px;
}

form button {
    height: 3em;
    margin: 0 0.5em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #4361EE;
    color: white;
    cursor: pointer;
    line-height: 0;
    transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
}

form button:hover {
    background-color: white;
    color: #4361EE;
}

form button:active {
    background-color: #bbb;
}

form span {
    font-size: 2em;
    font-weight: bold;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>