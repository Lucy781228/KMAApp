<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Lucy Mills <ct040407@actvn.edu.vn>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\KMAApp\Tests\Unit\Controller;

use OCA\KMAApp\Controller\NoteApiController;

class NoteApiControllerTest extends NoteControllerTest {
	public function setUp(): void {
		parent::setUp();
		$this->controller = new NoteApiController($this->request, $this->service, $this->userId);
	}
}
