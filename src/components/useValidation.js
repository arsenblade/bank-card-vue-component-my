import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/yup";
import {object, string} from "yup";
import {computed, watch} from "vue";

const currentYY = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    return Number(year.toString().substr(-2));
})

const currentMM = computed(() => {
    const date = new Date();
    let month = date.getMonth() + 1;
    month < 10 && (month = "0" + month);

    return month;
})

const maxYY = computed(() => {
    return currentYY.value + 10;
})

export const useValidation = (props) => {
    const minYear = props.isYearValidation ? currentYY.value : 0

    const { values, errors: localErrors, defineField, handleSubmit, validate, validateField, setFieldError, resetForm } = useForm({
        initialValues: {
            localCardNumber: props.cardNumber.value,
            localExpDateMonth: props.expDateMonth.value,
            localExpDateYear: props.expDateYear.value,
            localCvv: props.cvv.value
        },
        validationSchema: toTypedSchema(
            object({
                localCardNumber: string().required('Вам нужно заполнить это поле').min(16, 'Вам нужно заполнить это поле'),
                localExpDateMonth: string()
                    .required('Введите дату как на карте')
                    .test(
                        'is-valid-month',
                        'Вам нужно заполнить это поле',
                        (value, context) => {
                            const month = parseInt(value, 10);
                            const year = parseInt(context.parent.localExpDateYear, 10);

                            if (isNaN(month) || isNaN(year)) return false;

                            const minMonth = year === minYear ? currentMM.value : 1;
                            return month >= minMonth && month <= 12;
                        }
                    ),
                localExpDateYear: string()
                    .required('Введите год как на карте')
                    .test(
                        'is-valid-year',
                        `Введите год как на карте`,
                        function (value) {
                            const year = parseInt(value, 10);

                            if (isNaN(year)) return false;
                            if (!props.isYearValidation) return true

                            return year >= currentYY.value && year <= maxYY.value;
                        }
                    ),
                localCvv: string().required('Вам нужно заполнить это поле'),
            })
        ),
    });

    const [localCardNumber, localCardNumberAttrs] = defineField('localCardNumber', {
        validateOnModelUpdate: false,
        validateOnBlur: false,
    });
    const [localExpDateMonth, localExpDateMonthAttrs] = defineField('localExpDateMonth', {
        validateOnModelUpdate: false,
        validateOnBlur: false,
    });
    const [localExpDateYear, localExpDateYearAttrs] = defineField('localExpDateYear', {
        validateOnModelUpdate: false,
        validateOnBlur: false,
    });
    const [localCvv, localCvvAttrs] = defineField('localCvv', {
        validateOnModelUpdate: false,
        validateOnBlur: false,
    });

    watch(() => props.cardNumber, (newValue) => {
        localCardNumber.value = newValue
    }, {immediate: true})

    watch(() => props.expDateMonth, (newValue) => {
        localExpDateMonth.value = newValue
    }, {immediate: true})

    watch(() => props.expDateYear, (newValue) => {
        localExpDateYear.value = newValue
    }, {immediate: true})

    watch(() => props.cvv, (newValue) => {
        localCvv.value = newValue
    }, {immediate: true})

    return {
        values,
        localErrors,
        setFieldError,
        resetForm,
        validate,
        validateField,
        localCardNumber, localCardNumberAttrs,
        localExpDateMonth, localExpDateMonthAttrs,
        localExpDateYear, localExpDateYearAttrs,
        localCvv, localCvvAttrs
    }
}
