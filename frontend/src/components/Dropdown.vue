<template>
  <div class="dropdown" @click="toggleDropdown">
    <button class="dropdown-button">{{ title }}</button>
    <div v-if="isOpen" class="dropdown-menu">
      <ul>
        <li v-for="item in items" :key="item.id" @click="selectItem(item)">
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      default: 'Dropdown'
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectItem(item) {
      this.$emit('item-selected', item);
      this.isOpen = false;
    }
  }
};
</script>

<style lang="scss">
.dropdown {
  position: relative;
  display: inline-block;

  .dropdown-button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: #2980b9;
    }
  }

  .dropdown-menu {
    display: block;
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 12px 16px;
        cursor: pointer;
        &:hover {
          background-color: #f1f1f1;
        }
      }
    }
  }
}
</style>
