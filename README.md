Yii2 Admin Modals
=================
Display your admin actions in bootstrap modals with frames and callbacks.

**Current status:** Work in progress.

Installation
------------

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```
php composer.phar require --prefer-dist devgroup/yii2-admin-modals "*"
```

or add

```
"devgroup/yii2-admin-modals": "*"
```

to the require section of your `composer.json` file.


Usage
-----

### 1. Configure application

Attach `DevGroup\AdminModals\behaviors\AdminModalsBehavior` either to controller or application for use in all controllers.

For using in all controllers - attach behavior through modifying main app config:

```php
return [
    // your app config here
    // ...
    
    // add behavior
    'as adminModals' => [
        'class' => AdminModalsBehavior::class,
        'layoutFile' => '@app/actions/views/empty-layout',
    ],
];
```

`AdminModalsBehavior` takes the following params:

- **layoutFile**(required) - The path to simplified layout file without your headers, footers, containers etc. This layout is used when your action is rendered inside modal's frame.
- **magicParamKey** and **uniqueParamKey** - Names of GET parameters that are used for communicating between JS part and yii2 backend.

### 2. Add `admin-modals` action

Admin-modals action is used for displaying simple empty page inside modal's frame during loading the needed route.

You can show loader spinner there.
 
By default JS part of yii2-admin-modals will load '/site/admin-modal'. That could be configured later.

For adding action modify your Controller actions() function:

```php
    public function actions()
    {
        return [
            // other actions here...
            
            'admin-modal' => [
                'class' => DevGroup\AdminModals\actions\EmptyPageAction::class,
                'viewFile' => '@DevGroup/AdminModals/views/admin-modal',
                'layoutFile' => '@app/actions/views/empty-layout',
            ]
        ];
    }
```

`EmptyPageAction` takes the following params:

- **layoutFile** - The same as in `AdminModalsBehavior` but is not required. If not set - the default controller layout will be used.
- **viewFile** - The view file location for empty page. By default sample view is used. The only requirement to this view file is to include form tag with `admin-modal__frame-form` class that would be used for loading actions with POST method.

### 3. Frontend configuration

At first you need to add dependency to `DevGroup\AdminModals\assets\AdminModalsBundle` in you main application AssetBundle:

```php

class AppAsset extends AssetBundle
{
    // your stuff here

    public $depends = [
        // add dependency
        DevGroup\AdminModals\assets\AdminModalsBundle::class,
    ];
}

```

If you need to configure JS-part of yii2-admin-modals - add javascript object before AdminModalsBundle loads(for example after opening body tag):

```js
window.AdminModalsSettings = {
    modalActionSelector: '.admin-modal-trigger',
    dataAttribute: 'adminModals',
    adminModalPageUrl: '/site/admin-modal',
    adminModalFrameFormSelector: '.admin-modal__frame-form',
    magicParamKey: '__admin_modals',
    adminModalsUniqueParamKey: '__admin-modals__unique-id'
}
```

### 4. Use your modals

All links and buttons with `admin-modal-trigger` class assigned will automatically call opening modal windows instead of direct action performing.

Example code:

```html
<a href="/admin/user/edit?id=1" class="btn btn-primary modal-test admin-modal-trigger">
    Open user #1 edit form in modal!
</a>
```


### How to manually trigger modal?

An example for showing confirmation on deletion of jstree node:

```js
function confirmDelete(node) {
  AdminModals.modalOpen({
    url: '/category/delete',
    data: {
      id: $(node.reference[0]).data('id')
    },
    method: 'GET'
  });
  return false;
}
```

That will display `/category/delete?id=###` in modal.

## TODO

- [ ] Describe data option
- [ ] Implement callbacks
- [ ] Callbacks documentation
- [ ] Describe the main concept(iframe -> location|form.submit -> storage events -> extract buttons ...)
- [ ] Test app
    - [ ] Simple modal demo
    - [ ] GridView actions demo (test with pjax too)
    - [ ] Deploy live version
    - [ ] Codeception functional tests
    - [ ] Screenshots and demo-video
- [ ] Add cool badges
- [ ] Remove console.log
- [ ] ???
- [ ] PROFIT!!! _and spread the word_