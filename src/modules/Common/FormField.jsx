import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useAsyncState } from "@modules/utils";
import "@styles/modules/form-field.scss";

// import TextField from "@material-ui/core/TextField";
const TextField = React.forwardRef(({ id, label, value, onChangeInput, helperText, errorMsg, ...restProps }, ref) => {
    return (
        <div className={`form-group${errorMsg ? " form-group-error" : ""}`}>
            <label className="form-control-label" htmlFor={id}>
                {label}
            </label>
            <input
                ref={ref}
                id={id}
                className={`form-control-alternative form-control`}
                onChange={e => onChangeInput(e.target.value)}
                {...restProps}
            />
            <span className={`form-control-helper-text`}>{helperText}</span>
        </div>
    );
});

import Select from "react-select";
const SelectField = React.forwardRef(
    (
        { id, label, options = [], value, defaultValue, onChangeInput, disabled, helperText, errorMsg, ...restProps },
        ref
    ) => {
        useEffect(() => {
            /**
             * scenario 1 - if value is passed instead of object and is present in the given options
             */
            if (value !== "" && typeof value !== "object") {
                let val = options.find(opt => opt.value === value);
                if (val) {
                    onChangeInput(val);
                }
            }

            /**
             * scenario 2 - if defaultValue is passed
             */
            if (value === "" && defaultValue !== "") {
                if (typeof defaultValue === "object") {
                    let val = options.find(opt => opt.value === defaultValue.value);
                    if (val) {
                        onChangeInput(val);
                    }
                } else {
                    let val = options.find(opt => opt.value === defaultValue);
                    if (val) {
                        onChangeInput(val);
                    }
                }
            }

            /**
             * scenario 1 - populate single option
             */
            if (options.length === 1) {
                onChangeInput(options[0]);
            }

            return () => {};
        }, [value, defaultValue, options]);

        return (
            <div className={`form-group${errorMsg ? " form-group-error" : ""}`}>
                {label && (
                    <label className="form-control-label" htmlFor={id}>
                        {label}
                    </label>
                )}
                <Select
                    ref={ref}
                    id={id}
                    styles={{
                        control: (styles, state) => ({
                            ...styles,
                            ...(state.isFocussed
                                ? {
                                      boxShadow: "none"
                                  }
                                : {}),
                            height: "43px",
                            border: 0,
                            borderRadius: "0.375rem",
                            boxShadow: "0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)",
                            WebkitBoxShadow: "0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)",
                            transition: "box-shadow 0.15s ease, -webkit-box-shadow 0.15s ease"
                        })
                    }}
                    options={options}
                    value={value}
                    onChange={newVal => onChangeInput(newVal)}
                    isDisabled={disabled}
                    {...restProps}
                />
                <span className={`form-control-helper-text`}>{helperText}</span>
            </div>
        );
    }
);

const DateTimeField = React.forwardRef(
    ({ id, label, value, onChangeInput, helperText, errorMsg, ...restProps }, ref) => {
        return (
            <div className={`form-group${errorMsg ? " form-group-error" : ""}`}>
                <label className="form-control-label" htmlFor={id}>
                    {label}
                </label>
                <input
                    style={{ width: "100%", color: !value ? "transparent" : "" }}
                    className={"form-control-alternative form-control"}
                    type="date"
                    id={id}
                    value={value ? new Date(timeRange.min).toISOString().split("T")[0] : ""}
                    onChange={e => onChangeInput(new Date(e.target.value).valueOf())}
                />
                <span className={`form-control-helper-text`}>{helperText}</span>
            </div>
        );
    }
);

const commonValidationProfiles = {
    default(val, config = {}) {
        if (val === "" || val === null || val === undefined) {
            let emptyErr = config.emptyErr || `Please enter ${config.label || config.hiddenLabel || "this field"}`;
            return {
                valid: false,
                errorMsg: emptyErr
            };
        } else {
            return {
                valid: true
            };
        }
    },
    email(val, config = {}) {
        // let regex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
        let regex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        let valid = regex.test(val);
        return {
            valid,
            errorMsg: `Please Enter Valid ${config.label || config.hiddenLabel || "Input"}`
        };
    }
};
const getValidators = validationProfileKeys => {
    let validators = (validationProfileKeys || []).map(v => {
        if (commonValidationProfiles[v] === undefined) {
            if (typeof v === "function") return v;
            if (v instanceof RegExp || validationService.validRegex(v)) {
                let regExp = v;
                if (validationService.validRegex(v)) regExp = validationService.regexpStringToObj(v);
                return value => ({
                    valid: regExp.test(value),
                    errorMsg: "Invalid Input"
                });
            }
            console.error(`no validation profile found for ${v}`);
        }
        return commonValidationProfiles[v];
    });
    return validators;
};
const REGEX_SPLITTER = "REGEX_SPLITTER";
const validationService = {
    regexpStringToObj(regexpString) {
        let regexpMatcher = /\/(.+)\/([gmiyus]{0,6})/;
        let regexpWithoutSlashes = regexpString.replace(regexpMatcher, `$1${REGEX_SPLITTER}$2`);
        return new RegExp(...regexpWithoutSlashes.split(REGEX_SPLITTER));
    },
    validRegex(str) {
        let isValid = true;
        try {
            new RegExp(str);
        } catch (e) {
            isValid = false;
        }
        return isValid;
    },
    validate(validators, { value, config }) {
        let results = [];
        for (let i = 0; i < validators.length; i++) {
            let validator = validators[i];
            if (validator) results.push(validator(value, config));
        }
        return results;
    }
};

const formFields = {
    text: TextField,
    select: SelectField,
    date: DateTimeField
};
const FormField = React.forwardRef(
    (
        {
            controlled = false,
            type = "text",
            id = `uniqId-${+new Date()}`,
            value = "",
            onChange,
            disabled,
            required,
            validationProfiles, // registered common validation methods
            inputValidator, // custom validation method
            inputValidations, // validate user input before setting it in state
            liveValidations, // validate on every input update
            ...restProps
        },
        ref
    ) => {
        let fieldOpts = {
            // options that are to be passed ahead
            type,
            id,
            disabled,
            ...restProps
        };

        const inputRef = useRef();
        const [_value, setValue] = useAsyncState("");
        const [errorMsg, setErrorMsg] = useState("");

        useEffect(() => {}, []);

        const focus = () => inputRef.current.focus();

        const getVal = () => (controlled ? value : _value);

        const setVal = val => setValue(val);

        const setError = msg => setErrorMsg(msg);

        const clearError = () => setErrorMsg("");

        const val = val => {
            if (val === undefined) return getVal();
            return setVal(val);
        };

        const isValid = () => {
            if ((required === false && getVal() === "") || disabled) {
                clearError();
                return true;
            }
            let validators = [
                ...(inputValidator ? [inputValidator] : []),
                ...getValidators(validationProfiles ? ["default", ...validationProfiles] : ["default"])
            ];
            let validationResults = validationService.validate(validators, {
                value: getVal(),
                fieldOpts
            });
            let errors = validationResults.filter(v => !v.valid);
            if (errors.length) setError(errors[0].errorMsg);
            return errorMsg ? false : errors.length === 0; /* In case error is set explicitly */
        };

        const isInputValid = value => {
            let validators = getValidators(inputValidations);
            let validationResults = validationService.validate(validators, {
                value,
                fieldOpts
            });
            return validationResults.every(v => v.valid === true);
        };

        const liveValidate = value => {
            let liveValidators = getValidators(liveValidations || ["default"]);
            let validationResults = validationService.validate(liveValidators, {
                value,
                fieldOpts
            });
            let errors = validationResults.filter(v => v.valid === false);
            if (errors.length) setError(errors[0].errorMsg);
        };

        const onChangeInput = async (newVal, notFromUser) => {
            if (inputValidations && !isInputValid(newVal)) return;
            clearError();
            if (controlled) {
                if (liveValidations) liveValidate(newVal);
                if (onChange) onChange(newVal);
                return;
            }
            await setVal(newVal);
            if (liveValidations) liveValidate(newVal);
            if (onChange && !notFromUser) onChange(newVal);
        };

        useImperativeHandle(ref, () => ({
            focus,
            isValid,
            val,
            setError,
            clearError
        }));

        let Field = formFields[type];
        if (!Field) {
            Field = formFields["text"];
            console.error(`FormField type : ${type} not found, falling back to 'text'`);
        }
        return (
            <Field
                ref={inputRef}
                value={controlled ? value : _value}
                onChangeInput={onChangeInput}
                errorMsg={errorMsg}
                helperText={errorMsg} // later accomodate warning and default texts
                {...fieldOpts}
            />
        );
    }
);

export default FormField;
