#define PY_SSIZE_T_CLEAN
#include <Python.h>

#include "tree_sitter/parser.h"

typedef struct TSLanguage TSLanguage;

extern TSLanguage *tree_sitter_tonel_smalltalk(void);

static PyObject *_binding_language(PyObject *Py_UNUSED(self), PyObject *Py_UNUSED(args)) {
    return PyLong_FromVoidPtr(tree_sitter_tonel_smalltalk());
}

static PyMethodDef methods[] = {
    {"language", _binding_language, METH_NOARGS,
     "Get the tree-sitter language pointer for this grammar."},
    {NULL, NULL, 0, NULL},
};

static struct PyModuleDef_Slot slots[] = {
#ifdef Py_GIL_DISABLED
    {Py_mod_gil, Py_MOD_GIL_NOT_USED},
#endif
    {0, NULL}
};

static struct PyModuleDef module = {
    .m_base = PyModuleDef_HEAD_INIT,
    .m_name = "_binding",
    .m_doc = NULL,
    .m_size = 0,
    .m_methods = methods,
    .m_slots = slots,
};

PyMODINIT_FUNC PyInit__binding(void) {
    return PyModuleDef_Init(&module);
}
