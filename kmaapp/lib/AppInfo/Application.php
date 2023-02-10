<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Lucy Mills <ct040407@actvn.edu.vn>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\KMAApp\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
	public const APP_ID = 'kmaapp';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}
}
