<template>
    <div class="number-picker-container" @touchstart.prevent="handleTouchStart" @touchmove.prevent="handleTouchMove"
        @touchend.prevent="handleTouchEnd" @wheel.prevent="handleWheel">
        <div class="picker-wrapper">
            <div class="picker-inner" :style="{ transform: `translateY(${offset + centerOffset}px)` }">
                <div v-for="item in displayItems" :key="item" class="picker-item"
                    :class="{ 'picker-item-selected': isItemInCenter(item) }">
                    {{ item }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        validator: (value) => value.length > 0
    },
    defaultValue: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(['update:value']);

const ITEM_HEIGHT = 40;
const centerOffset = computed(() => ITEM_HEIGHT);

const offset = ref(0);
const selectedValue = ref(props.defaultValue ?? props.items[0]);
const touchStartY = ref(0);
const startOffset = ref(0);
let isScrolling = false;

const displayItems = computed(() => {
    return props.items;
});

const isItemInCenter = (item) => {
    const currentPosition = offset.value;
    const itemIndex = props.items.indexOf(item);
    const itemPosition = -itemIndex * ITEM_HEIGHT;
    const tolerance = ITEM_HEIGHT / 2;

    return Math.abs(currentPosition - itemPosition) < tolerance;
};

const handleTouchStart = (e) => {
    touchStartY.value = e.touches[0].clientY;
    startOffset.value = offset.value;
};

const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY.value;
    const newOffset = startOffset.value + deltaY;
    updateOffset(newOffset);

    updateCenterItem();
};

const handleTouchEnd = () => {
    snapToClosestItem();
};

const handleWheel = (e) => {
    if (isScrolling) return;
    isScrolling = true;

    const newOffset = offset.value - Math.sign(e.deltaY) * ITEM_HEIGHT;
    updateOffset(newOffset);
    updateCenterItem();
    snapToClosestItem();

    setTimeout(() => {
        isScrolling = false;
    }, 50);
};

const updateOffset = (newOffset) => {
    const maxOffset = 0;
    const minOffset = -(props.items.length - 1) * ITEM_HEIGHT;
    offset.value = Math.min(maxOffset, Math.max(minOffset, newOffset));
};

const updateCenterItem = () => {
    const centerIndex = Math.round(-offset.value / ITEM_HEIGHT);
    if (centerIndex >= 0 && centerIndex < props.items.length) {
        const centerItem = props.items[centerIndex];
        if (selectedValue.value !== centerItem) {
            selectedValue.value = centerItem;
            emit('update:value', centerItem);
        }
    }
};

const snapToClosestItem = () => {
    const targetOffset = Math.round(offset.value / ITEM_HEIGHT) * ITEM_HEIGHT;
    offset.value = targetOffset;
    updateCenterItem();
};

onMounted(() => {
    if (props.defaultValue) {
        const index = props.items.indexOf(props.defaultValue);
        if (index !== -1) {
            offset.value = -index * ITEM_HEIGHT;
        }
    }

    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('.number-picker-container')) {
            e.preventDefault();
        }
    }, { passive: false });
});
</script>

<style scoped>
.number-picker-container {
    position: relative;
    width: 60px;
    height: 120px;
    overflow: hidden;
    touch-action: none;
}

.picker-wrapper {
    position: relative;
    height: 120px;
    overflow: hidden;
}

.picker-inner {
    transition: transform 0.1s linear;
}

.picker-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #808080;
    opacity: 0.5;
    user-select: none;
    transition: color 0.2s ease;
}

.picker-item-selected {
    color: #090909;
    opacity: 1;
}
</style>